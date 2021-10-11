const mysql = require('../mysql')

const tableName = 'base_user'

// 获取用户列表
exports.sqlGetUserList = async ({ pageNum, pageSize }) => {
  const start = (pageNum - 1) * pageSize
  let sql = `select count(*) from ${tableName};select username,create_time as createTime from ${tableName} limit ?,?;`
  let res = await mysql.query(sql, [start, pageSize])
  let total = res[0][0]['count(*)']
  return {
    data: {
      total,
      totalPage: Math.ceil(total / pageSize),
      list: res[1],
    },
  }
}

// 新建用户
exports.sqlAddUser = async ({ username, password }) => {
  let sql = `insert into ${tableName} (username,password,create_time) values (?,?,?)`
  let isExist = (await mysql.query(`select * from ${tableName} where username=?`, [username])).length > 0
  if (isExist) {
    return {
      message: '用户名已存在',
      success: false,
    }
  }
  let res = await mysql.query(sql, [username, password, new Date()])
  return {
    data: res,
  }
}

// 删除用户
exports.sqlDeleteUser = async ({ username }) => {
  let sql = `delete from ${tableName} where username=?`
  let res = await mysql.query(sql, [username])
  return {
    data: res,
  }
}
