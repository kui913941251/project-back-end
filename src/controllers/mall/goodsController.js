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

  async detail(ctx) {
    const { id } = ctx.request.body

    if (!id) {
      return ctx.fail({ message: '请传入商品id' })
    }

    let goods = await GoodsDao.findOne({
      where: {
        id,
      },
      attributes: ['goodsName', 'id', 'goodsDesc', 'createTime'],
    })

    if (goods) {
      ctx.success({ data: goods })
    } else {
      ctx.fail({ message: '商品信息获取失败' })
    }
  }

  async update(ctx) {
    const { id, goodsName, goodsDesc } = ctx.request.body

    if (!id) {
      return ctx.fail({ message: '请传入商品id' })
    } else if (!goodsName) {
      return ctx.fail({ message: '请传入商品名称' })
    }

    let res = await GoodsDao.update(
      {
        goodsName,
        goodsDesc,
      },
      {
        where: {
          id,
        },
      }
    )

    if (res) {
      ctx.success({ message: '修改成功' })
    } else {
      ctx.fail({ message: '修改失败' })
    }
  }

  async delete(ctx) {
    const { id } = ctx.request.body

    if (!id) {
      return ctx.fail({ message: '请传入商品id' })
    }

    let res = await GoodsDao.destroy({
      where: {
        id,
      },
    })

    if (res === 1) {
      ctx.success({ message: '删除成功' })
    } else {
      ctx.fail({ message: '删除失败' })
    }
  }
}

module.exports = new GoodsController()
