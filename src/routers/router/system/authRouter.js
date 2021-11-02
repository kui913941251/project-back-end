const Router = require('@koa/router')
const authController = require('@/controllers/system/authController')
const LoginVerify = require('@/middlewares/LoginVerify')
const AuthVerify = require('@/middlewares/AuthVerify')

const authRouter = new Router({ prefix: '/system' })

authRouter
  .post('/auth/tree', LoginVerify, AuthVerify('SYSTEM_AUTH_LIST'), authController.tree)
  .post('/auth/add', LoginVerify, AuthVerify('SYSTEM_AUTH_ADD'), authController.add)
  .post('/auth/update', LoginVerify, AuthVerify('SYSTEM_AUTH_UPDATE'), authController.update)
  .post('/auth/delete', LoginVerify, AuthVerify('SYSTEM_AUTH_DELETE'), authController.delete)

module.exports = authRouter
