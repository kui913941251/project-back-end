const db = require('@/db/mysql/index')

class AuthDao {
  constructor() {}

  async findAuthByPid({ pid = null }) {
    let sql
    if (pid) {
      sql = `select * from system_auth where pid = ?`
      return await db.query(sql, [pid])
    } else {
      sql = `select * from system_auth where pid is null`
      return await db.query(sql)
    }
  }

  async add({ authName = '', authCode = '', level, pid = null }) {
    const sql = `insert into system_auth (auth_name, auth_code, pid, level) values (?,?,?,?)`
    return await db.query(sql, [authName, authCode, pid, level])
  }

  async update({ authName, authCode, id }) {
    const sql = `update system_auth set auth_name = ? , auth_code = ? where id = ?`
    return await db.query(sql, [authName, authCode, id])
  }

  async delete({ id }) {
    const sql = `delete from system_auth where id = ?`
    return await db.query(sql, [id])
  }
}

module.exports = new AuthDao()
