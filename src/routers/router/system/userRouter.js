const Router = require('@koa/router')
const UserController = require('@/controllers/system/userController')
const LoginVerify = require('@/middlewares/LoginVerify')

const userRouter = new Router({ prefix: '/system' })

userRouter
  .post('/user/register', UserController.registerUser)
  .post('/user/login', UserController.login)
  .get('/user/captcha', UserController.captcha)
  .post('/user/logout', UserController.logout)
  .post('/user/delete', LoginVerify, UserController.deleteUser)
  .post('/user/list', LoginVerify, UserController.userList)
  .post("/user/bindRole", LoginVerify, UserController.bindRole)

module.exports = userRouter
