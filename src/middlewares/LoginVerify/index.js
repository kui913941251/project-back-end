const { tokenRedis, userRedis } = require('@/db/redis')

module.exports = async function (ctx, next) {
  let token = ctx.get('Authorization')
  let user = await tokenRedis.get(token)
  console.log(user);
  if (!user) {
    ctx.fail({ message: '登录已过期，请重新登录' })
  } else if (user.expires < Date.now()) {
    tokenRedis.destroy(token)
    userRedis.destroy(user.username)
    ctx.fail({ message: '登录已过期，请重新登录' })
  } else {
    await next()
  }
}
