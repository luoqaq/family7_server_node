const fs = require('fs')
import Koa from 'koa'

export default (app: Koa<Koa.DefaultState, Koa.DefaultContext>) => {
  fs.readdirSync(__dirname).forEach((file: string) => {
    console.log('file', file)
    if (file === 'index.ts') {
      return
    }
    const route = require(`./${file}`)
    app.use(route.routes()).use(route.allowedMethods())
  })
}
