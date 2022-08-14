import Koa from 'koa'

interface IResOptions {
  successCode?: number
  successMsg?: string
  failCode?: number
  failMsg?: string
}

const routerResponse = (options: IResOptions = {}) => {
  return async function (ctx: Koa.DefaultContext, next: Koa.Next) {
    ctx.success = (data?: any, code?: number, msg?: string) => {
      ctx.body = {
        code: code || options.successCode || 0,
        msg: msg || options.successMsg || 'success',
        data: data || null,
      }
    }

    ctx.fail = (code: number, msg: string, data?: any) => {
      ctx.body = {
        code: code || options.failCode || 100,
        msg: msg || options.failMsg || 'default error',
        data: data || null,
      }
    }

    await next()
  }
}

export default routerResponse
