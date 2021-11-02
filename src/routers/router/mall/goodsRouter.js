const Router = require('@koa/router')
const goodsController = require("@/controllers/mall/goodsController")

const goodsRouter = new Router({ prefix: '/mall/goods' })

goodsRouter.post("/add", goodsController.add).post("/list", goodsController.list)


module.exports = goodsRouter