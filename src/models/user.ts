import mongoose from 'mongoose'

const { Schema, model } = mongoose

const UserSchema = new Schema({
  openid: { type: String, required: true, unique: true },
  name: { type: String },
  phone: { type: String },
})

const userModel = model('User', UserSchema)

export default userModel
