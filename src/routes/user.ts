import Router from 'koa-router'
import UserController from '../controllers/user'
// import jwt from 'jsonwebtoken'
const router = new Router()

const { login, update, getUsers, deleteUser } = UserController

// 用户登录
router.post('/public/users/', login)

// 用户更新
router.patch('/users/', update)

// 获取所有用户，仅管理员可用，需要token
router.post('/private/users/', getUsers)

// 删除用户，仅管理员可用，需要token
router.post('/private/users/delete/', deleteUser)

module.exports = router
