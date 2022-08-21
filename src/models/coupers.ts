import mongoose from 'mongoose'

const { Schema, model } = mongoose

const CouperSchema = new Schema({
  openid: { type: String, required: true, unique: true },
  couper_openid: { type: String, required: true, unique: true },
  bind_date: { type: Date },
  unbind_date: { type: Date },
  unbind_reasone: { type: String },
  is_binding: { type: Boolean, required: true },
})

const couperModel = model('Couper', CouperSchema)

export default couperModel
