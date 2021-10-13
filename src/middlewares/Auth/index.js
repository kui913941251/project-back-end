const config = require('./config')

const { getUrl } = require('@/utils/CommomUtils')
const { tokenRedis } = require('@/db/redis')

module.exports = async function (ctx, next) {
  let { url } = ctx
  console.log(ctx.req)
  if (config.whiteList.indexOf(getUrl(url)) === -1) {
    try {
      let token = ctx.get('Authorization')
      let user = await tokenRedis.get(token)
      if (!user) {
        ctx.fail({ message: '登录已过期，请重新登录' })
      } else if (user.expires < Date.now()) {
        tokenRedis.destroy(token)
        ctx.fail({ message: '登录已过期，请重新登录' })
      } else {
        await next()
      }
    } catch (error) {
      ctx.fail({ message: 'token is error, please relogin', status: 401 })
    }
  } else {
    await next()
  }
}
