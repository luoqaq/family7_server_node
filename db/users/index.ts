const UserModel = require('./model')

function getUser(user = {}) {
    const u = new UserModel(user);
    u.findOne()
}

function addUser(user) {

}

module.exports = {

}