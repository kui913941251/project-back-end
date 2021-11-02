const GoodsDao = require('@/models/Dao/mall/GoodsDao')
const PageUtil = require('@/utils/PageUtil')
const { Op } = require('sequelize')

class GoodsController {
  constructor() {}

  async list(ctx) {
    const { goodsName = '', pageNum = 1, pageSize = 10 } = ctx.request.body

    let res = await GoodsDao.findAndCountAll({
      where: {
        goodsName: {
          [Op.startsWith]: goodsName,
        },
      },
      limit: pageSize,
      offset: pageNum - 1,
    })

    ctx.success({ data: PageUtil(res.rows, res.count, pageNum, pageSize) })
  }

  async add(ctx) {
    const { goodsName, goodsDesc } = ctx.request.body

    if (!goodsName) {
      return ctx.fail({ message: '请传入商品名称' })
    }

    let existGoods = await GoodsDao.findOne({
      where: {
        goodsName,
      },
    })

    if (existGoods) {
      return ctx.fail({ message: '该商品名称已经存在' })
    }

    let res = await GoodsDao.create({
      goodsName,
      goodsDesc,
    })

    if (res) {
      ctx.success({ message: '添加成功' })
    } else {
      ctx.fail({ message: '添加失败' })
    }
  }
}

module.exports = new GoodsController()
