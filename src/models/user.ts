import mongoose from 'mongoose'

const { Schema, model } = mongoose

const UserSchema = new Schema({
  openid: { type: String, required: true, unique: true },
  name: { type: String },
  phone: { type: String },
  avatar_url: { type: String },
  createDate: { type: Date },
  updateDate: { type: Date },
  updateCount: { type: Number },
})

const userModel = model('User', UserSchema)

export default userModel
