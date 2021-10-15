const Router = require('@koa/router')

const userRouter = require('./router/public/userRouter')
const roleRouter = require('./router/system/roleRouter')

const router = new Router({ prefix: '/api' }) // 添加api前缀

router.use(userRouter.routes()).use(roleRouter.routes())

module.exports = router
