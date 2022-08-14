import User from '../models/user'
import Koa from 'koa'
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

const createUser = async (ctx: Koa.DefaultContext) => {
  console.log('controller-user-cereate-1', ctx.request.body)
  ctx.verifyPrams({
    openid: { type: 'string', required: true },
  })
  const { name, openid } = ctx.request.body
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
    ...ctx.request.body,
  }
  const user = await new User(params).save()
  return user
}

class UserController {
  async create(ctx: Koa.DefaultContext) {
    const user = await createUser(ctx)
    ctx.body = user
  }

  async login(ctx: Koa.DefaultContext) {
    ctx.verifyParams({
      openid: { type: 'string', required: true },
    })
    const { openid } = ctx.request.body
    const user = await User.findOne({ openid })
    if (user) {
      ctx.success(user)
    } else {
      const new_user = await createUser(ctx)
      ctx.success(new_user)
    }
  }

  async update(ctx: Koa.DefaultContext) {
    ctx.verifyParams({
      openid: { type: 'string', required: true },
      name: { type: 'string', required: true },
    })
    const { openid } = ctx.request.body
    const user = await User.findOne({ openid })
    if (user) {
      try {
        await User.updateOne({ openid }, { ...ctx.request.body })
        ctx.success('更新成功')
      } catch (error) {
        ctx.error(error)
      }
    } else {
      const new_user = await createUser(ctx)
      ctx.success(new_user)
    }
  }
}

export default new UserController()
