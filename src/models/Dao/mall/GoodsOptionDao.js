const sequelize = require("../sequelize")
const Sequelize = require("sequelize")

const GoodsOptionDao = sequelize.define("mall_goods_option", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  goodsId: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  optionName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  optionCount: {
    type: Sequelize.INTEGER,
    allowNull: false
  }
})

// GoodsOptionDao.sync()

module.exports = GoodsOptionDao