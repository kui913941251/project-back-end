const db = require('@/db/mysql')

const tableName = 'system_user'

class UserDao {
  constructor() {}
  async login({ username, password }) {
    const sql = `select * from ${tableName} where username = ? and password = ?`
    return await db.query(sql, [username, password])
  }

  async findUserById({ id }) {
    const sql = `select * from ${tableName} where id = ?`
    return await db.query(sql, [id])
  }

  async findUserByName({ username }) {
    const sql = `select * from ${tableName} where username = ?`
    return await db.query(sql, [username])
  }

  async register({ username, password }) {
    const sql = `insert into ${tableName} (username,password) values (?,?)`
    return await db.query(sql, [username, password])
  }

  async userList({ username = '', pageNum, pageSize }) {
    username = '%' + username + '%'
    const start = (pageNum - 1) * pageSize
    const sql =
      `select count(*) from ${tableName} where is_delete = 0 and (username like ? or ? = null);` +
      `select * from ${tableName} where is_delete = 0 and (username like ? or ? = null) limit ?,?`
    return await db.query(sql, [username, username, username, username, start, +pageSize])
  }

  async update({ username, password, id }) {
    const sql = `update ${tableName} set username = ?, password = ? where id = ?`
    return await db.query(sql, [username, password, id])
  }

  async deleteUser({ id }) {
    const sql = `update ${tableName} set is_delete = 1 where id = ?`
    return await db.query(sql, [id])
  }

  async bindRole({ id, roleIdList = [] }) {
    const sql = `delete from system_user_bind_role where user_id = ?`
    await db.query(sql, [id])
    for (let i = 0; i < roleIdList.length; i++) {
      const bindSql = `insert into system_user_bind_role (user_id, role_id) values(?, ?)`
      await db.query(bindSql, [id, roleIdList[i]])
    }
    return true
  }

  async getUserAuthList({ id }) {
    const sql = `select * from system_auth where id in 
    (select auth_id from system_role_bind_auth where role_id in
    (select role_id from system_user_bind_role where user_id = ?))`
    return await db.query(sql, [id])
  }
}

module.exports = new UserDao()
