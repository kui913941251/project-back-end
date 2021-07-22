const Router = require("@koa/router")
const router = new Router();
const routes = require("./routes/index")
const config = require("./config")
router.post("/login", routes.login)

module.exports = router