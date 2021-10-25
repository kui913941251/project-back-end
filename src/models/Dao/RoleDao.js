const db = require('@/db/mysql/index')

class RoleDao {
  constructor() {}
  async list({ roleName = null, pageNum = 1, pageSize = 10 }) {
    roleName = '%' + roleName + '%'
    const start = (pageNum - 1) * pageSize
    const sql =
      'select count(*) from system_role where (role_name like ? or ? = null) and id not in (1);' +
      'select * from system_role where (role_name like ? or ? = null) and id not in (1) group by create_time desc, id desc limit ?,? '
    return await db.query(sql, [roleName, roleName, roleName, roleName, start, +pageSize])
  }

  async add({ roleName, des }) {
    const sql = `insert into system_role (role_name, des) values (?, ?)`
    return await db.query(sql, [roleName, des])
  }

  async findRole({ id }) {
    const sql = `select * from system_role where id = ?`
    return await db.query(sql, [id])
  }

  async update({ roleName, id, des }) {
    const sql = `update system_role set role_name = ?, des = ? where id = ?`
    return await db.query(sql, [roleName, des, id])
  }

  async delete({ id }) {
    const sql = `delete from system_role where id = ?`
    return await db.query(sql, [id])
  }

  async findAuthList({ id }) {
    const sql = `select * from system_role_bind_auth where role_id = ?`
    return await db.query(sql, [id])
  }

  async bindAuth({ id, authIdList = [] }) {
    const deleteSql = `delete from system_role_bind_auth where role_id = ?`
    await db.query(deleteSql, [id])
    for (let i = 0; i < authIdList.length; i++) {
      const bindSql = `insert into system_role_bind_auth (role_id, auth_id) values (? , ?)`
      await db.query(bindSql, [id, authIdList[i]])
    }
    return true
  }
}

module.exports = new RoleDao()
