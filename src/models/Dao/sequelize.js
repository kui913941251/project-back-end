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
    underscored:true, // 更新时间、创建时间、是否删除字段 驼峰、下划线映射
    updatedAt: 'updateTime',
    createdAt: 'createTime',
  },
})

module.exports = sequelize
