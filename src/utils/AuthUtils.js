const { toSha256 } = require('./CommomUtils')

function getToken(id) {
  return toSha256(id + Date.now())
}

module.exports = {
  getToken,
}
