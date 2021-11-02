const sequelize = require("../sequelize")
const Sequelize = require("sequelize")

const GoodsDao = sequelize.define("mall_goods", {
  id: {
    type: Sequelize.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  goodsName: {
    type: Sequelize.STRING,
    allowNull: false
  },
  goodsDesc: {
    type: Sequelize.STRING
  }
})


GoodsDao.sync()


module.exports = GoodsDao