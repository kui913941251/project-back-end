let authArr = ["SYSTEM_ROLE_BIND_AUTH"]

module.exports = function(authCode) {

  return async function(ctx, next) {
    if (authArr.indexOf(authCode) === -1) {
      ctx.fail({message: "无权访问"})
    }else {
      await next()
    }
  }
}