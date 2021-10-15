const db = require('@/db/mysql/index')

class RoleDao {
  constructor() {}
  async list({ roleName = null, pageNum = 1, pageSize = 10 }) {
    const start = (pageNum - 1) * pageSize
    const sql = `select count(*) from system_role;select * from system_role limit ?,?`
    return await db.query(sql, [start, +pageSize])
  }

  async add({ roleName }) {
    const sql = `insert into system_role (role_name) values (?)`
    return await db.query(sql, [roleName])
  }

  async update({ roleName, roleId }) {
    const sql = `update system_role set role_name = ? where id = ?`
    return await db.query(sql, [roleName, roleId])
  }

  async delete({ roleId }) {
    const sql = `delete from system_role where id = ?`
    return await db.query(sql, [roleId])
  }
}

module.exports = new RoleDao()
