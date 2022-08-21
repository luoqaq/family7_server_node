import Router from 'koa-router'
import CouperController from '../controllers/couper'
// import jwt from 'jsonwebtoken'
const router = new Router()

const {
  getBindRequest,
  getPostedBindRequest,
  readBindRequest,
  readBindResponse,
  requestBind,
  requestCancelBind,
  rejectBind,
  acceptBind,
  getAllCoupers,
  getAllRecords,
} = CouperController

// 获取当前用户被申请的绑定
router.get('/bind_requests/', getBindRequest)

router.get('/bind_requests/posted/', getPostedBindRequest)

// 申请绑定或者解绑
router.post('/bind_requests/', requestBind)

// 取消申请
router.post('/bind_requests/cancel/', requestCancelBind)

// 对申请标记为已读
router.post('/bind_requests/read/', readBindRequest)

// 申请人对回复标记为已读
router.post('/bind_requests/read_res/', readBindResponse)

// 拒绝绑定
router.post('/bind_requests/reject/', rejectBind)

// 接受绑定
router.post('/bind_requests/accept/', acceptBind)

// 获取所有情侣，仅管理员可用，需要token
router.post('/private/coupers/', getAllCoupers)
// 获取所有记录，仅管理员可用，需要token
router.post('/private/bind_request_records/', getAllRecords)

module.exports = router
