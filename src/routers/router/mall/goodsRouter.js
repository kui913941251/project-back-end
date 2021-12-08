const Router = require('@koa/router')
const goodsController = require('@/controllers/mall/goodsController')

const LoginVerify = require('@/middlewares/LoginVerify')
const goodsRouter = new Router({ prefix: '/mall/goods' })

goodsRouter
  .post('/add', LoginVerify, goodsController.add)
  .post('/list', LoginVerify, goodsController.list)
  .post('/detail', LoginVerify, goodsController.detail)
  .post('/update', LoginVerify, goodsController.update)
  .post('/delete', LoginVerify, goodsController.delete)
  .post("/import", LoginVerify, goodsController.import)
  .post("/addGroup", LoginVerify, goodsController.addGroup)
  
module.exports = goodsRouter  
