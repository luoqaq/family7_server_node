import userModel from '../models/user'
import couperModel from '../models/coupers'
import bindRequestModel from '../models/bindRequest'
import Koa from 'koa'
import { verifyT } from '../utils/utils'

const bindCouper = async (openid: string, couper_openid: string) => {
  const repeatCouper = await couperModel.findOne({ openid, couper_openid, is_binding: true })
  if (repeatCouper) {
    return Promise.reject(`两个用户已经绑定或解绑,${openid}-${couper_openid}`)
  }
  const createCouperParams = {
    openid,
    couper_openid,
    is_binding: true,
    bind_date: +new Date(),
  }
  try {
    const newCouper = await new couperModel(createCouperParams).save()
    if (newCouper) {
      await userModel.updateOne({ openid }, { couper_openid })
      await userModel.updateOne({ openid: couper_openid }, { couper_openid: openid })
    }
    return Promise.resolve('绑定或解绑成功')
  } catch (error) {
    return Promise.reject(error)
  }
}

class CouperController {
  // 获取当前用户收到的请求
  async getBindRequest(ctx: Koa.DefaultContext) {
    const { openid, user_id } = ctx.state
    try {
      console.log('getBindRequest', user_id)
      const records = await bindRequestModel.find({ target_id: user_id, is_complete: false })
      console.log('getBindRequest records', records)
      ctx.success(records)
    } catch (error) {
      console.log('getBindRequest error', error)
    }
  }

  async getPostedBindRequest(ctx: Koa.DefaultContext) {
    const { openid } = ctx.state
    const record = await bindRequestModel.findOne({ openid, is_complete: false })
    ctx.success(record)
  }

  // 标记某条绑定或解绑请求记录为已读
  async readBindRequest(ctx: Koa.DefaultContext) {
    ctx.verifyParams({
      bind_requst_id: { type: 'string', required: true },
    })
    const { bind_requst_id } = ctx.request.body
    const res = await bindRequestModel.updateOne({ _id: bind_requst_id }, { is_send_request: true })
    ctx.success(res)
  }

  // 标记某条绑定或解绑回复记录为已读
  async readBindResponse(ctx: Koa.DefaultContext) {
    ctx.verifyParams({
      bind_requst_id: { type: 'string', required: true },
    })
    const { bind_requst_id } = ctx.request.body
    const res = await bindRequestModel.updateOne({ _id: bind_requst_id }, { is_send_source: true })
    ctx.success(res)
  }

  // 发送绑定或解绑请求
  async requestBind(ctx: Koa.DefaultContext) {
    ctx.verifyParams({
      target_id: { type: 'string', require: true },
      is_bind: { type: 'boolean', required: true },
    })
    const { openid } = ctx.state
    const { target_id, is_bind } = ctx.request.body
    const repeatRecord = await bindRequestModel.findOne({ openid, is_complete: false })
    if (repeatRecord) {
      ctx.fail(1, `已经发出过绑定或解绑请求`, repeatRecord)
      return
    }
    const params = {
      openid,
      target_id,
      is_bind,
      create_date: +new Date(),
      is_send_request: false,
      is_send_source: false,
      is_complete: false,
      // complete_date: null,
      // complete_type: '',
      // complete_reason: '',
    }
    const res = await new bindRequestModel(params).save()
    ctx.success('发送成功')
  }

  // 取消绑定或解绑请求
  async requestCancelBind(ctx: Koa.DefaultContext) {
    ctx.verifyParams({
      reason: { type: 'string', require: true },
    })
    const { openid } = ctx.state
    const record = await bindRequestModel.findOne({ openid, is_complete: false })
    if (!record) {
      ctx.fail(1, '未找到绑定或解绑请求')
      return
    }
    const { reason } = ctx.request.body
    const params = {
      ...record,
      is_complete: true,
      complete_date: +new Date(),
      complete_type: 3,
      complete_reason: reason,
      is_send_source: true,
    }
    const res = await bindRequestModel.update({ openid, is_complete: false }, params)
    ctx.success('发送成功')
  }

  // 拒绝绑定或解绑请求
  async rejectBind(ctx: Koa.DefaultContext) {
    const { openid, user_id } = ctx.state
    const record = await bindRequestModel.findOne({ target_id: user_id, is_complete: false })
    if (!record) {
      ctx.fail(1, '未找到绑定或解绑请求')
      return
    }
    const { reason = '' } = ctx.request.body
    const params = {
      ...record,
      is_complete: true,
      complete_date: +new Date(),
      complete_type: 2,
      complete_reason: reason,
    }
    const res = await bindRequestModel.updateOne({ target_id: user_id, is_complete: false }, params)
    ctx.success('发送成功')
  }

  // 接受绑定或解绑请求
  async acceptBind(ctx: Koa.DefaultContext) {
    const { user_id, openid } = ctx.state
    const record = await bindRequestModel.findOne({ target_id: user_id, is_complete: false })
    if (!record) {
      ctx.fail(1, '未找到绑定或解绑请求')
      return
    }
    const { reason = '' } = ctx.request.body
    const params = {
      ...record,
      is_complete: true,
      complete_date: +new Date(),
      complete_type: 1,
      complete_reason: reason,
    }
    const res = await bindRequestModel.updateOne({ target_id: user_id, is_complete: false }, params)
    if (res) {
      try {
        await bindCouper(record.openid, openid)
      } catch (error) {
        ctx.fail(-1, error)
      }
    }
    ctx.success('发送成功')
  }

  // 获取所有绑定或解绑请求记录
  async getAllRecords(ctx: Koa.DefaultContext) {
    verifyT(ctx, async () => {
      const records = await bindRequestModel.find()
      ctx.success(records)
    })
  }

  // 获取所有情侣关系
  async getAllCoupers(ctx: Koa.DefaultContext) {
    verifyT(ctx, async () => {
      const coupers = await couperModel.find()
      ctx.success(coupers)
    })
  }
}

export default new CouperController()
