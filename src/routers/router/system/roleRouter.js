const Router = require('@koa/router')
const roleController = require('@/controllers/system/roleController')
const LoginVerify = require('@/middlewares/LoginVerify')
const AuthVerify = require('@/middlewares/AuthVerify')

const roleRouter = new Router({ prefix: '/system' })

roleRouter
  .post('/role/list', LoginVerify, AuthVerify('SYSTEM_ROLE_LIST'), roleController.list)
  .post('/role/add', LoginVerify, AuthVerify('SYSTEM_ROLE_ADD'), roleController.add)
  .post('/role/detail', LoginVerify, AuthVerify('SYSTEM_ROLE_DETAIL'), roleController.detail)
  .post('/role/update', LoginVerify, AuthVerify('SYSTEM_ROLE_UPDATE'), roleController.update)
  .post('/role/delete', LoginVerify, AuthVerify('SYSTEM_ROLE_DELETE'), roleController.delete)
  .post('/role/bindAuth', LoginVerify, roleController.bindAuth)

module.exports = roleRouter
