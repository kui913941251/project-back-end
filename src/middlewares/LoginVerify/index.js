const { tokenRedis, userRedis } = require('@/db/redis')

module.exports = async function (ctx, next) {
  let token = ctx.get('Authorization')
  let user = await userRedis.get(token)
  console.log("登录的用户为:" , user);
  if (!user) {
    ctx.fail({ message: '登录已过期，请重新登录' })
  } else if (user.expires < Date.now()) {
    userRedis.destroy(token)
    tokenRedis.destroy(user.username)
    ctx.fail({ message: '登录已过期，请重新登录' })
  } else {
    await next()
  }
}
