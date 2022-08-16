import jsonwebtoken from 'jsonwebtoken'
import koa from 'koa'
import { IJwtPayload } from '../@types'
import { jwtExpiresIn, jwtSecret } from '../config/config'

export default {
  sign: (ctx: koa.DefaultContext, info: IJwtPayload) => {
    console.log('sign-info', info)
    const token = jsonwebtoken.sign(info, jwtSecret, { expiresIn: jwtExpiresIn })
    console.log('sing-token', token)
    ctx.set('Authorization', `Bearer ${token}`)
    ctx.cookies.set('token', token, {
      maxAge: jwtExpiresIn,
      httpOnly: true,
    })
    console.log('chegg')
    return token
  },

  verify: async (ctx: koa.DefaultContext, decodeToken: object, token: string) => {
    let ret = true
    try {
      const payload = await jsonwebtoken.verify(token, jwtSecret)
      ctx.state = payload
      ret = false
    } catch (error) {
      console.log('verify error', error)
    }
    return ret
  },
}
