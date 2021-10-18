const db = require('@/db/mysql')

const tableName = 'system_user'

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
    const sql = `select count(*) from ${tableName};select username,create_time as createTime from ${tableName} limit ?,?`
    return await db.query(sql, [start, pageSize])
  }

  async deleteUser(username, password) {
    const sql = `delete from ${tableName} where username = ?`
    return await db.query(sql, [username, password])
  }

  async bindRole({ userId, roleIdList = [] }) {
    const sql = `delete from system_user_bind_role where user_id = ?`
    await db.query(sql, [userId])
    for (let i = 0; i < roleIdList.length; i++) {
      const bindSql = `insert into system_user_bind_role (user_id, role_id) values(?, ?)`
      await db.query(bindSql, [userId, roleIdList[i]])
    }
    return true
  }

  async getUserAuthList({ userId }) {
    const sql = `select * from system_auth where id in 
    (select auth_id from system_role_bind_auth where role_id in
    (select role_id from system_user_bind_role where user_id = ?))`
    return await db.query(sql, [userId])
  }
}

module.exports = new UserDao()
