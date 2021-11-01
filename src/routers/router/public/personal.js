const Router = require('@koa/router')

const personalController = require('@/controllers/public/personalController')

const LoginVerify = require('@/middlewares/LoginVerify')

const personalRouter = new Router({ prefix: '/personal' })

personalRouter.post('/userInfo', LoginVerify, personalController.userInfo).post('/import', LoginVerify, personalController.importAvatar)

module.exports = personalRouter
