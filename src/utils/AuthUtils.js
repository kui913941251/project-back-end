const globalConfig = require('../globalConfig')
const { toSha256 } = require('./CommomUtils')

function getToken(id) {
  return toSha256(id + Date.now() + globalConfig.tokenSalt)
}

function encryptedPassword(password) {
  return toSha256(password + globalConfig.tokenSalt)
}

module.exports = {
  getToken,
  encryptedPassword
}
