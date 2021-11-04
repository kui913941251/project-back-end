require('module-alias/register') // 路径别名
const Koa = require('koa')
const koaBody = require('koa-body')
const koaLogger = require('koa-logger')
const koaStatic = require('koa-static')
const koaCors = require("koa-cors")
const path = require('path')

const routers = require('@/routers/index')
const RouterResponse = require('@/middlewares/RouterResponse/index')
const CatchError = require('@/middlewares/FatchError/index')
const addTransaction = require("@/middlewares/Transaction")

const app = new Koa()

app.use(koaCors())

app.use(CatchError)

// 设置全局返回参数
app.use(RouterResponse())

// 解析post请求参数
app.use(
  koaBody({
    multipart: true,
    formidable: {
      hash: "md5"
    }
  })
)

// 打印请求信息
app.use(koaLogger())

// 开启静态资源服务
app.use(koaStatic(path.join(__dirname, '/static')))

// 添加全局事物处理
app.use(addTransaction)

// 设置路由
app.use(routers.routes())

// 未匹配路由则返回404
app.use(async function (ctx, next) {
  ctx.fail({ message: '404 not found', code: 404, status: 404 })
})

app.listen(3000, () => {
  console.log('Server is running at http://localhost:3000')
})
