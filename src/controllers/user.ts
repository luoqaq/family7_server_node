import User from '../models/user'
import Koa from 'koa'
import { getOpenid } from '../service/weixin'
import auth from '../utils/auth'
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
  console.log('controller-user-cereate-1', data)
  const { name, openid } = data
  if (!openid) {
    ctx.throw(-1, 'createUser openid 为空')
  }
  const repeatUser = await User.findOne({ openid })
  console.log('repeatUser', repeatUser)
  if (repeatUser) {
    console.log('用户已存在', repeatUser)
    ctx.throw(409, '用户已存在')
  }
  if (name) {
    const repeatName = await User.findOne({ name })
    if (repeatName) {
      console.log('用户名已存在', repeatName)
      ctx.throw(409, '用户名已存在')
    }
  }
  const deafultName = await getUserName()
  const params = {
    name: deafultName,
    ...data,
  }
  const user = await new User(params).save()
  return user
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
        const token = auth.sign(ctx, { openid: user.openid })
        ctx.success({
          user,
          token,
        })
      } else {
        ctx.fail(-1, 'error', res.data)
      }
    } catch (e) {
      ctx.fail(-1, 'error', e)
    }
  }

  async update(ctx: Koa.DefaultContext) {
    ctx.verifyParams({
      name: { type: 'string', required: true },
    })
    const { openid } = ctx.state
    const user = await User.findOne({ openid })
    if (user) {
      try {
        await User.updateOne({ openid }, { ...ctx.request.body, openid })
        ctx.success('更新成功')
      } catch (error) {
        ctx.error(error)
      }
    } else {
      const new_user = await createUser(ctx, { openid })
      ctx.success(new_user)
    }
  }
}

export default new UserController()
