const db = require('@/db/mysql')

class FileDao {
  constructor() {}

  async findFile({ fileId }) {
    const sql = `select file_name as fileName, file_path as filePath from base_file where id = ?`
    return await db.query(sql, [fileId])
  }

  async findFileByHash({ hash }) {
    const sql = `select * from base_file where hash = ?`
    return await db.query(sql, [hash])
  }

  async add({ path, fileName, hash }) {
    const sql = `insert into base_file (file_path, file_name, hash) values (?, ?, ?)`
    return await db.query(sql, [path, fileName, hash])
  }

  async delete({ fileId }) {
    const sql = `delete from base_file where id = ?`
    return await db.query(sql, [fileId])
  }
}

module.exports = new FileDao()
