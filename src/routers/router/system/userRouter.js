const Router = require('@koa/router')
const UserController = require('@/controllers/system/userController')
const LoginVerify = require('@/middlewares/LoginVerify')
const AuthVerify = require("@/middlewares/AuthVerify")

const userRouter = new Router({ prefix: '/system/user' })

userRouter
  .post('/register', UserController.register)
  .post('/login', UserController.login)
  .get('/captcha', UserController.captcha)
  .post('/logout', UserController.logout)
  .post("/info", LoginVerify, UserController.info)
  .post('/list', LoginVerify, AuthVerify("SYSTEM_USER_LIST"), UserController.userList)
  .post('/add', LoginVerify, AuthVerify("SYSTEM_USER_ADD"), UserController.add)
  .post("/update", LoginVerify, AuthVerify("SYSTEM_USER_UPDATE"),UserController.update)
  .post('/delete', LoginVerify, AuthVerify("SYSTEM_USER_DELETE"),UserController.deleteUser)
  .post("/bindRole", LoginVerify, AuthVerify("SYSTEM_USER_LIST"),UserController.bindRole)

module.exports = userRouter
