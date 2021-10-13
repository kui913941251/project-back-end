const Router = require('@koa/router')
const UserController = require('@/controllers/userController')

const userRouter = new Router()

userRouter
  .post('/user/register', UserController.registerUser)
  .post('/user/login', UserController.login)
  .post('/user/delete', UserController.deleteUser)
  .post("/user/list", UserController.userList)
  .post("/user/logout", UserController.logout)
  .get("/user/captcha", UserController.captcha)

module.exports = userRouter
