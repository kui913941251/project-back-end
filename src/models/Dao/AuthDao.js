const db = require('@/db/mysql/index')

class AuthDao {
  constructor() {}

  async tree({ pid = null }) {
    let sql
    if (pid) {
      sql = `select * from system_auth where pid = ?`
      return await db.query(sql, [pid])
    } else {
      sql = `select * from system_auth where pid is null`
      return await db.query(sql)
    }
  }

  async add({ authName = '', authCode = '', pid = null }) {
    const sql = `insert into system_auth (auth_name, auth_code, pid) values (?,?,?)`
    return await db.query(sql, [authName, authCode, pid])
  }
}

module.exports = new AuthDao()
