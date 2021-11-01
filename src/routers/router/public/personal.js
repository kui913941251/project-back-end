const Router = require('@koa/router')

const personalController = require('@/controllers/public/personalController')

const LoginVerify = require('@/middlewares/LoginVerify')

const personalRouter = new Router({ prefix: '/personal' })

personalRouter
  .post('/userInfo', LoginVerify, personalController.userInfo)
  .post('/importAvatar', LoginVerify, personalController.importAvatar)
  .post('/changeAvatar', LoginVerify, personalController.changeAvatar)

module.exports = personalRouter
