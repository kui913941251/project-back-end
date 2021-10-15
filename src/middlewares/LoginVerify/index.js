const config = require('./config')

const { getUrl } = require('@/utils/CommomUtils')
const { tokenRedis, userRedis } = require('@/db/redis')

const router = require('@/routers/index')
const routers = router.stack.map((item) => item.path)

module.exports = async function (ctx, next) {
  let { url } = ctx

  // 判断当前路径是否为已注册路由
  if (routers.indexOf(getUrl(url)) !== -1) {
    if (config.whiteList.indexOf(getUrl(url)) === -1) {
      // try {
        let token = ctx.get('Authorization')
        let user = await tokenRedis.get(token)
        if (!user) {
          ctx.fail({ message: '登录已过期，请重新登录' })
        } else if (user.expires < Date.now()) {
          tokenRedis.destroy(token)
          userRedis.destroy(user.username)
          ctx.fail({ message: '登录已过期，请重新登录' })
        } else {
          await next()
        }
      // } catch (error) {
      //   ctx.fail({ message: 'token is error, please relogin', status: 401 })
      // }
    } else {
      await next()
    }
  } else {
    ctx.fail({ message: '404 not found', code: 404, status: 404 })
  }
}
