const Koa = require('koa');
const app = new Koa();
const router = require("./routers/router")
const routerResponse = require("./middlewares/RouterResponse/index")
const bodyParser = require("koa-bodyparser")

// 解析post请求参数
app.use(bodyParser())

// 判断是否有权限
// app.use()

// 打印请求信息
app.use(async (ctx, next) => {
  await next();
  const rt = ctx.response.get('X-Response-Time');
  console.log(`${ctx.method} ${ctx.url} - ${rt}`);
});
// 设置请求时间
app.use(async (ctx, next) => {
  const start = Date.now();
  await next();
  const ms = Date.now() - start;
  ctx.set('X-Response-Time', `${ms}ms`);
});

// 设置全局返回参数
app.use(routerResponse())


// 设置路由
app.use(router.routes())
app.use(router.allowedMethods())

app.listen(3000, () => {
  console.log("Server is running at http://localhost:3000");
});


