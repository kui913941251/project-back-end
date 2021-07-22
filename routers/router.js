const Router = require("@koa/router")
const router = new Router();
const routes = require("./routes/index")
const config = require("./config")
// public
router.post("/public/login", routes.login)

// music
router.get("/music/getSearchByKey", routes.getSearchByKey)

module.exports = router