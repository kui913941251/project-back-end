const Router = require('@koa/router')
const authController = require('@/controllers/system/authController')
const LoginVerify = require('@/middlewares/LoginVerify')

const authRouter = new Router({ prefix: '/system' })

authRouter.post('/auth/add', LoginVerify, authController.add).post('/auth/tree', LoginVerify, authController.tree)

module.exports = authRouter
