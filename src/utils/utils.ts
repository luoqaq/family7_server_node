import Koa from 'koa'
import { TOKEN } from '../config/config'

export const verifyT = (ctx: Koa.DefaultContext, cb: () => void) => {
  try {
    if (ctx.request.body?.token === TOKEN) {
      cb()
    } else {
      ctx.fail(-1, 'no permission')
    }
  } catch (error) {
    ctx.fail(-1, 'error', error)
  }
}
