import Koa from 'koa'
import mongoose from 'mongoose'
import { TOKEN } from '../config/config'

export const verifyT = (ctx: Koa.DefaultContext, cb: () => void) => {
  try {
    if (ctx.request.body?.token === TOKEN) {
      cb()
    } else {
      ctx.fail(404, 'no permission')
    }
  } catch (error) {
    ctx.fail(1, 'error', error)
  }
}

export const isEnableToken = (ctx: Koa.DefaultContext) => {
  if (ctx.request.body?.token !== TOKEN) {
    ctx.fail(401, 'no permission')
  }
  return ctx.request.body?.token === TOKEN
}

export const getMongoId = (id: string) => {
  return new mongoose.Types.ObjectId(id)
}
