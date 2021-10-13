const cryptojs = require("crypto-js")
const globalConfig = require("../globalConfig")

function toSimpleObject(target) {
  let simpleObj = {}
  Object.keys(target).forEach(key => {
    simpleObj[key] = target[key]
  })
  return simpleObj
}

function toSha256(value) {
  return cryptojs.SHA256(value + globalConfig.secretKey).toString()
}

module.exports = {
  toSimpleObject,
  toSha256
}