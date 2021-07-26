function routerResponse(options = {}) {
  return async function(ctx, next) {
    ctx.success = function(payload) {
      ctx.type = payload.type || "json"
      ctx.body = {
        code: payload.code || 200,
        success: true,
        message: payload.message || "success",
        data: payload.data
      }
    }

    ctx.fail = function(payload) {
      ctx.type = payload.type || "json"
      ctx.body = {
        code: payload.code || 400,
        success: false,
        message: payload.message,
        data: ""
      }
    }

    await next()
  }
}


module.exports = routerResponse