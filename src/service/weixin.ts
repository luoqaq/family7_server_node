import axios from 'axios'
import { WEIXIN } from '../config/config'

interface IRes<T> {
  data: T
  status: number
  [name: string]: any
}

interface ICodeSession {
  session_key?: string
  unionid?: string
  errmsg?: string
  openid?: string
  errcode?: number
}

// export const getOpenid: (code: string) => Promise<IRes<ICodeSession>> = (code) =>
//   axios.get(
//     `https://api.weixin.qq.com/sns/jscode2session?appid=${WEIXIN.apppid}&secret=${WEIXIN.secret}&js_code=${code}&grant_type=authorization_code`
//   )

export const getOpenid: (code: string) => Promise<IRes<ICodeSession>> = (code) =>
  Promise.resolve({
    data: { openid: code },
    status: 200,
  })
