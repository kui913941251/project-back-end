const Router = require('@koa/router')
const authController = require('@/controllers/system/authController')
const LoginVerify = require('@/middlewares/LoginVerify')

const authRouter = new Router({ prefix: '/system' })

authRouter
  .post('/auth/tree', LoginVerify, authController.tree)
  .post('/auth/add', LoginVerify, authController.add)
  .post('/auth/update', LoginVerify, authController.update)
  .post("/auth/delete", LoginVerify, authController.delete)

module.exports = authRouter
