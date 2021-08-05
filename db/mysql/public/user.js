const mysql = require("../mysql")

// 获取用户列表
exports.getUserList = async ({pageNum, pageSize}) => {
  const start = (pageNum - 1) * pageSize
  let sql = "select count(*) from base_user;select username,create_time as createTime from base_user limit ?,?;"
  let res = await mysql.query(sql, [start,pageSize])
  let total = res[0][0]["count(*)"]
  return {
    total,
    totalPage: Math.ceil(total / pageSize),
    list: res[1]
  }
}

