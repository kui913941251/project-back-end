const mysql = require("../mysql")

const tableName = "base_user"

// 获取用户列表
exports.sqlGetUserList = async ({pageNum, pageSize}) => {
  const start = (pageNum - 1) * pageSize
  let sql = `select count(*) from ${tableName};select username,create_time as createTime from ${tableName} limit ?,?;`
  let res = await mysql.query(sql, [start,pageSize])
  let total = res[0][0]["count(*)"]
  return {
    total,
    totalPage: Math.ceil(total / pageSize),
    list: res[1]
  }
}

// 新建用户
exports.sqlAddUser = async ({username, password}) => {
  let sql = `insert into ${tableName} (username,password) values (?,?)`
  let res = await mysql.query(sql, [username,password])
  return {
    res
  }
}
