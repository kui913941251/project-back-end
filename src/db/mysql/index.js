const mysql = require('mysql')
const config = require('./config')

const pool = mysql.createPool({
  host: config.database.HOST,
  user: config.database.USERNAME,
  password: config.database.PASSWORD,
  database: config.database.DATABASE,
  multipleStatements: true, // 开启多语句查询
})

class Mysql {
  constructor() {}
  query(sql, params = []) {
    return new Promise((resolve, reject) => {
      pool.getConnection(function (err, connection) {
        if (err) {
          reject(err)
          return
        }
        connection.query(sql, params, function (error, results, fields) {
          console.log(`${sql}=>${params}`)
          // 释放连接
          connection.release()
          if (error) {
            reject(error)
            return
          }
          resolve(results)
        })
      })

      // pool.query(sql, values, function (error, results, fields) {
      //   if (error) {
      //     throw error;
      //   }
      //   resolve(results);
      //   // pool.end();
      // });
    })
  }
}

module.exports = new Mysql()
