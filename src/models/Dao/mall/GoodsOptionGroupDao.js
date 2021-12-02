const sequelize = require("../sequelize")
const Sequelize = require("sequelize")

const GoodsOptionGroupDao = sequelize.define("mall_goods_option_group", {
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
  groupIds: {
    type: Sequelize.STRING,
    allowNull: false
  },
  stocks: {
    type: Sequelize.INTEGER,
    allowNull: false
  },
  price: {
    type: Sequelize.FLOAT,
    allowNull: false
  }
})

// GoodsOptionDao.sync()

module.exports = GoodsOptionGroupDao