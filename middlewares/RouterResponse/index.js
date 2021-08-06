function routerResponse(options = {}) {
  return async function(ctx, next) {
    ctx.success = function({type = "json", code = 200, success = true, message = "success", data}) {
      ctx.type = type
      ctx.body = {
        code,
        success,
        message,
        data
      }
    }

    ctx.fail = function({type = "json", code = 400, message = "请求失败"}) {
      ctx.type = type
      ctx.body = {
        code,
        success: false,
        message
      }
    }

    await next()
  }
}


module.exports = routerResponse