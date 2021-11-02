const { Sequelize } = require('sequelize')
const mysqlConfig = require('@/db/mysql/config.js')

const sequelize = new Sequelize(mysqlConfig.database.DATABASE, mysqlConfig.database.USERNAME, mysqlConfig.database.PASSWORD, {
  host: mysqlConfig.database.HOST,
  port: mysqlConfig.database.PORT,
  underscored: true,
  timezone: mysqlConfig.database.TIMEZONE, //东八区
  dialect: 'mysql',
  define: {
    freezeTableName: true,  // 表名字不加s
    timestamps: true, // 开启保存时间戳
    underscored:true, // 开启驼峰(js)与下划线(数据库)字段的映射
    updatedAt: 'updateTime',
    createdAt: 'createTime',
    // paranoid: true, // 开启逻辑删除
    // deletedAt: "deleteTime"
  },
})

module.exports = sequelize
