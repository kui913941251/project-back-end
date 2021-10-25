const Router = require('@koa/router')
const roleController = require('@/controllers/system/roleController')
const LoginVerify = require('@/middlewares/LoginVerify')

const roleRouter = new Router({ prefix: '/system' })

roleRouter
  .post('/role/list', LoginVerify, roleController.list)
  .post('/role/add', LoginVerify, roleController.add)
  .post("/role/detail", LoginVerify, roleController.detail)
  .post('/role/update', LoginVerify, roleController.update)
  .post('/role/delete', LoginVerify, roleController.delete)
  .post("/role/bindAuth", LoginVerify, roleController.bindAuth)

module.exports = roleRouter
