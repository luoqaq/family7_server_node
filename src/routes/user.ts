import Router from 'koa-router'
import UserController from '../controllers/user'
// import jwt from 'jsonwebtoken'
const router = new Router({
  prefix: '/users',
})

const { login } = UserController

// 用户登录
router.post('/', login)

//

module.exports = router
