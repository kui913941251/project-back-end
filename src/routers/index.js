const Router = require("@koa/router")

const userRouter = require("./router/userRouter")

const router = new Router()

router.use(userRouter.routes())

module.exports = router