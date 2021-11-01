const db = require('@/db/mysql')

class PersonalDao {
  constructor() {}

  async userInfo({ id }) {
    const sql = `select * from system_user where id = ?`
    return await db.query(sql, [id])
  }

  async changeAvatar({ id, avatarPath }) {
    const sql = `update system_user set avatar = ? where id = ?`
    return await db.query(sql, [avatarPath, id])
  }
}

module.exports = new PersonalDao()
