const { sqlAddUser } = require("../../../db/mysql/public/user");

module.exports = async (ctx, next) => {
  const { username, password } = ctx.request.body;
  if (!username) {
    return ctx.fail({ message: "请输入用户名" });
  } else if (!password) {
    return ctx.fail({ message: "请输入密码" });
  } else {
    let res = await sqlAddUser({
      username,
      password,
    });
    ctx.success({
      data: res,
      message: "成功",
    });
  }
};
