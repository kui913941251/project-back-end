const GoodsDao = require('@/models/Dao/mall/GoodsDao')
const GoodsOptionDao = require('@/models/Dao/mall/GoodsOptionDao')
const PageUtil = require('@/utils/PageUtil')
const { Op } = require('sequelize')
const { userRedis } = require('@/db/redis/index')
const fs = require('fs')
const FileUtils = require('@/utils/FileUtils')

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
    const { goodsName, goodsDesc, options } = ctx.request.body

    if (!goodsName) {
      return ctx.fail({ message: '请传入商品名称' })
    } else if (!options) {
      return ctx.fail({ message: '请传入类型组合' })
    }

    let existGoods = await GoodsDao.findOne({
      where: {
        goodsName,
      },
    })

    if (existGoods) {
      return ctx.fail({ message: '该商品名称已经存在' })
    }

    ctx.transaction(async (t) => {
      let goodsRes = await GoodsDao.create(
        {
          goodsName,
          goodsDesc,
        },
        { transaction: t }
      )

      console.log(t)

      options.forEach((option, index) => {
        let optionCount = index
        option.forEach(async (item) => {
          await GoodsOptionDao.create(
            {
              goodsId: goodsRes.id,
              optionName: item.optionName,
              optionCount,
            },
            { transaction: t }
          )
        })
      })

      if (goodsRes) {
        ctx.success({ message: '添加成功' })
      } else {
        ctx.fail({ message: '添加失败' })
      }
    })
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

  async import(ctx) {
    const { file } = ctx.request.files
    const { fileType } = ctx.request.body

    if (!file) {
      return ctx.fail({ message: '请传入文件' })
    } else if (!fileType) {
      return ctx.fail({ message: '请传入文件类型' })
    }

    let fileName = ctx.request.body.fileName || file.name
    let fileMkd = '/file/avatar'
    let extname = path.extname(fileName)
    let hash = file.hash
    let targetFileName = hash + extname
    let filePath = path.join('/file/avatar', `/${targetFileName}`)

    let token = ctx.get('Authorization')

    let user = await userRedis.get(token)

    console.log(file)

    fs.unlinkSync(file.path)

    ctx.success({ data: file })
  }
}

module.exports = new GoodsController()
