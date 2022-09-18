import User from '../models/user'
import Koa from 'koa'
import { getOpenid } from '../service/weixin'
import auth from '../utils/auth'
import { TOKEN } from '../config/config'
import { isEnableToken } from '../utils/utils'
const CnName = require('faker-zh-cn')

// 生成一个不重名的名字
const getUserName = async () => {
  const userNames = await User.find().select('name')
  console.log('userNames', userNames)
  let name = CnName.Name.findName()
  while (userNames.includes(name)) {
    name = CnName.Name.findName()
  }
  return name
}

const createUser = async (ctx: Koa.DefaultContext, data: { openid: string; name?: string }) => {
  const { name, openid } = data
  if (!openid) {
    ctx.fail(1, 'createUser openid 为空')
  }
  const repeatUser = await User.findOne({ openid })
  if (repeatUser) {
    ctx.fail(409, '用户已存在')
  }
  if (name) {
    const repeatName = await User.findOne({ name })
    if (repeatName) {
      ctx.fail(409, '用户名已存在')
    }
  }
  const deafultName = await getUserName()
  const params = {
    name: deafultName,
    ...data,
    phone: '',
    avatar_url: '',
    create_date: +new Date(),
    update_date: +new Date(),
    update_count: 0,
    couper_openid: '',
  }
  const user = await new User(params).save()
  return user
}

const getUserByOpenid = async (openid: string) => {
  return await User.findOne({ openid })
}

class UserController {
  async login(ctx: Koa.DefaultContext) {
    ctx.verifyParams({
      code: { type: 'string', required: true },
    })
    const { code } = ctx.request.body
    try {
      const res = await getOpenid(code)
      console.log('res', res.data)
      if (res.data?.openid) {
        let user = await User.findOne({ openid: res.data.openid })
        if (!user) {
          user = await createUser(ctx, { openid: res.data.openid })
        }
        const token = auth.sign(ctx, { openid: user.openid, user_id: user._id })
        ctx.success({
          user,
          token,
        })
      } else {
        ctx.fail(1, 'error', res.data)
      }
    } catch (e) {
      ctx.fail(1, 'error', e)
    }
  }

  async update(ctx: Koa.DefaultContext) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
    })
    const { openid } = ctx.state
    const { name, phone } = ctx.request.body
    const filter: any = {
      openid: { $ne: openid },
      $or: [{ name }],
    }
    if (phone) {
      filter['$or'].push({ phone })
    }
    const repeatUser = await User.findOne(filter)
    if (repeatUser) {
      ctx.fail(1, 'name或phone已存在')
      return
    }
    const user = await User.findOne({ openid })
    if (user) {
      try {
        const params = {
          ...ctx.request.body,
          update_date: +new Date(),
          update_count: (user.update_count || 0) + 1,
        }
        delete params.openid
        await User.updateOne({ openid }, params)
        ctx.success('更新成功')
      } catch (error) {
        console.error('更新失败', error)
        ctx.fail(1, error)
      }
    } else {
      const new_user = await createUser(ctx, { openid })
      ctx.success(new_user)
    }
  }

  async getUsers(ctx: Koa.DefaultContext) {
    if (isEnableToken(ctx)) {
      const data = await User.find()
      ctx.success(data)
    }
  }

  async deleteUser(ctx: Koa.DefaultContext) {
    if (isEnableToken(ctx)) {
      const data = await User.deleteOne({ openid: ctx.request.body.openid })
      ctx.success(data)
    }
  }
}

export default new UserController()
