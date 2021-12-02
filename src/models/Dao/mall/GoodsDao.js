const sequelize = require('../sequelize')
const Sequelize = require('sequelize')
const { formatDate } = require('@/utils/DateUtil')

const GoodsDao = sequelize.define('mall_goods', {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  goodsName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  goodsDesc: {
    type: Sequelize.STRING,
  },
  optionMax: {
    type: Sequelize.INTEGER,
  },
  createTime: {
    type: Sequelize.DATE,
    get() {
      let time = this.getDataValue('createTime')
      return formatDate(time, 'YYYY-MM-DD HH:mm:ss')
    },
  },
})

// GoodsDao.sync()

module.exports = GoodsDao
