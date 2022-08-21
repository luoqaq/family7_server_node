import mongoose from 'mongoose'

const { Schema, model } = mongoose

const bindRequestSchema = new Schema({
  openid: { type: String, required: true, unique: true },
  target_id: { type: String, required: true, unique: true },
  is_bind: { type: Boolean },
  create_date: { type: Date },
  is_complete: { type: Boolean },
  complete_date: { type: Date },
  complete_type: { types: Number }, // 1-被接受 2-被拒绝 3-主动取消
  complete_reason: { type: String }, // 主动取消时的原因
  is_send_request: { type: Boolean }, // 是否已将消息发送给目标用户
  is_send_source: { type: Boolean }, // 当被拒绝时或被接受时是否发送给原用户
})

const bindRequestModel = model('BindRequestRecord', bindRequestSchema)

export default bindRequestModel
