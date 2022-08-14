import Koa from 'koa'
import Routes from './routes/index'
import { MongoURI } from './config/config'
import mongooses from 'mongoose'
import koaBody from 'koa-body'
import koaStatic from 'koa-static'
import koaJsonError from 'koa-json-error'
import routerResponse from './middleware/routerResponse'
const koaParameter = require('koa-parameter')
const path = require('path')
const app = new Koa()

mongooses.connect(MongoURI, {}, (err) => {
  if (err) {
    console.error({ msg: '[Mongoose] database connect failed!', err })
  } else {
    console.log('[Mongoose] database connect success !')
  }
})
app.use(koaStatic(path.join(__dirname, 'public')))
app.use(
  koaJsonError({
    postFormat: (e, { stack, ...rest }) => ({
      code: -1,
      msg: 'error',
      data: process.env.NODE_ENV === 'production' ? rest : { stack, ...rest },
    }),
  })
)
app.use(
  koaBody({
    multipart: true,
    encoding: 'gzip',
    formidable: {
      uploadDir: path.join(__dirname, '/public/uploads'),
      keepExtensions: true,
      maxFieldsSize: 10 * 1024 * 1024,
      onFileBegin: (name, file) => {},
    },
  })
)
app.use(koaParameter(app))
app.use(routerResponse())
Routes(app)
app.listen(3000, () => console.log('服务启动 3000'))
