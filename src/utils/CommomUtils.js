const cryptojs = require('crypto-js')
const globalConfig = require('../globalConfig')

function toSimpleObject(target) {
  let simpleObj = {}
  Object.keys(target).forEach((key) => {
    simpleObj[key] = target[key]
  })
  return simpleObj
}

function toSha256(value) {
  return cryptojs.SHA256(value + globalConfig.secretKey).toString()
}

function getUrl(url) {
  console.log(url)
  if (url.indexOf('?') !== -1) {
    url = url.split('?')[0]
  }
  return url
}

module.exports = {
  toSimpleObject,
  toSha256,
  getUrl,
}
