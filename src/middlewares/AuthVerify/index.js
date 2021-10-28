const { userRedis } = require('@/db/redis')

module.exports = function(authCode) {
  return async function(ctx, next) {
    let token = ctx.get('Authorization')
    let user = await userRedis.get(token)
    let authCodeList = user.authCodeList
    if (authCodeList.indexOf(authCode) === -1) {
      ctx.fail({message: "无权访问"})
    }else {
      await next()
    }
  }
}