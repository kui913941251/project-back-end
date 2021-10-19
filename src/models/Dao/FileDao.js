const db = require('@/db/mysql')

class FileDao {
  constructor() {}

  async findFile({ fileId }) {
    const sql = `select file_name as fileName, file_path as filePath from base_file where id = ?`
    return await db.query(sql, [fileId])
  }

  async add({ path, fileName }) {
    const sql = `insert into base_file (file_path, file_name) values (?, ?)`
    return await db.query(sql, [path, fileName])
  }

  async delete({ fileId }) {
    const sql = `delete from base_file where id = ?`
    return await db.query(sql, [fileId])
  }
}

module.exports = new FileDao()
