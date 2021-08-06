const { sqlDeleteUser } = require("../../../db/mysql/public/user");

module.exports = async (ctx, next) => {
  const {username} = ctx.request.body
  if (!username) {
    return ctx.fial({
      message: "请输入用户名"
    })
  }
  let res = await sqlDeleteUser({
    username
  });
  ctx.success({
    data: {
      ...res.data
    },
    message: res.message || "成功",
  });
};
