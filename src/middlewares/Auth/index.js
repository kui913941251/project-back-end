const redisClient = require('../../db/redis/index')
const config = require('./config')

module.exports = async function (ctx, next) {
  let { url } = ctx
  if (config.whiteList.indexOf(url) === -1) {
    ctx.fail({ message: 'need login' })
  } else {
    await next()
  }
}
