const Router = require("@koa/router")

const fileController = require("@/controllers/public/fileController")

const fileRouter = new Router({prefix: "/public"})

fileRouter.post("/file/import", fileController.import)


module.exports = fileRouter