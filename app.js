require('module-alias/register')   // 路径别名
const Koa = require('koa')
const bodyParser = require('koa-bodyparser')
const koaBody = require("koa-body")
const koaLogger = require('koa-logger')

const routers = require("@/routers/index")
const routerResponse = require('@/middlewares/RouterResponse/index')
const catchError = require('@/middlewares/catchError/index')
const Auth = require('@/middlewares/Auth/index')

const app = new Koa()

app.use(catchError)

// 设置全局返回参数
app.use(routerResponse())

// 是否登录
app.use(Auth)

// 解析post请求参数
// app.use(bodyParser())
app.use(koaBody())

// 判断是否有权限
// app.use()

// 打印请求信息
app.use(koaLogger())
// 设置路由
app.use(routers.routes())

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000')
})
