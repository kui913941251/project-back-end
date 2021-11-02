const Router = require('@koa/router')
const goodsController = require('@/controllers/mall/goodsController')

const goodsRouter = new Router({ prefix: '/mall/goods' })

goodsRouter
  .post('/add', goodsController.add)
  .post('/list', goodsController.list)
  .post('/detail', goodsController.detail)
  .post('/update', goodsController.update)
  .post('/delete', goodsController.delete)

module.exports = goodsRouter
