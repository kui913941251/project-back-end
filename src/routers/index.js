const Router = require('@koa/router')

const userRouter = require('./router/system/userRouter')
const roleRouter = require('./router/system/roleRouter')
const authRouter = require('./router/system/authRouter')

const router = new Router({ prefix: '/api' }) // 添加api前缀

router.use(userRouter.routes()).use(roleRouter.routes()).use(authRouter.routes())

module.exports = router
