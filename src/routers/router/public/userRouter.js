const Router = require('@koa/router')
const UserController = require('@/controllers/public/userController')
const LoginVerify = require('@/middlewares/LoginVerify')

const userRouter = new Router({ prefix: '/public' })

userRouter
  .post('/user/register', UserController.registerUser)
  .post('/user/login', UserController.login)
  .get('/user/captcha', UserController.captcha)
  .post('/user/logout', UserController.logout)
  .post('/user/delete', LoginVerify, UserController.deleteUser)
  .post('/user/list', LoginVerify, UserController.userList)

module.exports = userRouter
