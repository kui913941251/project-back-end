const Router = require('@koa/router')
const roleController = require('@/controllers/system/roleController')

const roleRouter = new Router({ prefix: '/system' })

roleRouter
  .post('/role/list', roleController.list)
  .post('/role/add', roleController.add)
  .post('/role/update', roleController.update)
  .post('/role/delete', roleController.delete)

module.exports = roleRouter
