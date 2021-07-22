module.exports = async (ctx, next) => {
  let {username, password} = ctx.request.body
  console.log(ctx.request.body);
  ctx.success({
    data: {
      username,
      password
    },
    message: "成功"
  })
  next()
}