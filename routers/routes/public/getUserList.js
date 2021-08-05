const { getUserList } = require("../../../db/mysql/public/user");

module.exports = async (ctx, next) => {
  const {pageNum = 1, pageSize = 10} = ctx.query
  let res = await getUserList({
    pageNum,
    pageSize
  });
  ctx.success({
    data: {
      pageNum,
      pageSize,
      ...res
    },
    message: "成功",
  });
};
