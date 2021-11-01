const db = require("@/db/mysql")

class PersonalDao {
  constructor() {}

  async userInfo({ id }) {
    const sql = `select * from system_user where id = ?`
    return await db.query(sql, [id])
  }

}


module.exports = new PersonalDao()
