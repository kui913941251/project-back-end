module.exports = async (ctx, next) => {
  let {username, password} = ctx.request.body
  ctx.success({
    data: {
      username,
      password
    },
    message: "成功"
  })
}