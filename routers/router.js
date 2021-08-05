const Router = require("@koa/router")
const router = new Router();
const routes = require("./routes/index")
const config = require("./config")
// public
router.post("/public/user/login", routes.userLogin)
router.post("/public/user/register", routes.userRegister)
router.get("/public/user/list", routes.userList)

// music
router.get("/music/getSearchByKey", routes.searchByKey)

module.exports = router