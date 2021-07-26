const Koa = require('koa');
const app = new Koa();
const router = require("./routers/router")
const routerResponse = require("./middlewares/RouterResponse/index")
const catchError = require("./middlewares/catchError/index")
const bodyParser = require("koa-bodyparser")
const koaLogger = require("koa-logger")

app.use(catchError)

// 解析post请求参数
app.use(bodyParser())

// 判断是否有权限
// app.use()

// 打印请求信息
app.use(koaLogger())
// 设置全局返回参数
app.use(routerResponse())
// 设置路由
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});


