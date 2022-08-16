import Router from 'koa-router'
import UserController from '../controllers/user'
// import jwt from 'jsonwebtoken'
const router = new Router({
  prefix: '/users',
})

const { login, update } = UserController

// 用户登录
router.post('/login', login)

// 用户更新
router.patch('/', update)

module.exports = router
