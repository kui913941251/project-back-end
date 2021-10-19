const db = require('@/db/mysql')

class FileDao {
  constructor() {}

  async add({ path, fileName }) {
    const sql = `insert into base_file (file_path, file_name) values (?, ?)`
    return await db.query(sql, [path, fileName])
  }

}

module.exports = new FileDao()
