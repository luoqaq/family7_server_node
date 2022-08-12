const mongoose = require('../index')

const { Schema, model } = mongoose;

const UserSchema = new Schema<>({
    _id: { type: String, required: true, unique: true },
    openid: { type: String, required: true, unique: true },
    name: { type: String },
    phone: { type: String },
})

module.exports = new model('User', UserSchema);