import mongoose from 'mongoose'

const { Schema, model } = mongoose

const UserSchema = new Schema({
  openid: { type: String, required: true, unique: true },
  name: { type: String },
  phone: { type: String },
  avatar_url: { type: String },
  create_date: { type: Date },
  update_date: { type: Date },
  update_count: { type: Number },
  couper_openid: { type: String },
})

const userModel = model('User', UserSchema)

export default userModel
