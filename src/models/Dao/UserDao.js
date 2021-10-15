const db = require('@/db/mysql')

const tableName = 'base_user'

class UserDao {
  constructor() {}
  async login(username, password) {
    const sql = `select * from ${tableName} where username = ? and password = ?`
    return await db.query(sql, [username, password])
  }

  async findUser(username) {
    const sql = `select * from ${tableName} where username = ?`
    return await db.query(sql, [username])
  }

  async register(username, password) {
    const sql = `insert into ${tableName} (username,password) values (?,?)`
    return await db.query(sql, [username, password])
  }

  async userList(pageNum, pageSize) {
    const start = (pageNum - 1) * pageSize
    const sql = `select count(*) from ${tableName};select username,create_time as createTime from ${tableName} limit ?,?;`
    return await db.query(sql, [start, pageSize])
  }

  async deleteUser(username, password) {
    const sql = `delete from ${tableName} where username = ?`
    return await db.query(sql, [username, password])
  }
}

module.exports = new UserDao()
