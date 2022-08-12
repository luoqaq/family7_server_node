const mongooses = require('mongoose');

const DB_URI = "mongodb://localhost:27017/db";

mongooses.connect(DB_URI, { useNewUrlParser: true, useUnifiedTopology: true }, err => {
    if (err) {
        console.error({msg: '[Mongoose] database connect failed!', err})
    } else {
        console.log('[Mongoose] database connect success !')
    }
})

module.exports = mongooses