const GoodsDao = require('@/models/Dao/mall/GoodsDao')
const GoodsOptionDao = require('@/models/Dao/mall/GoodsOptionDao')
const GoodsOptionGroupDao = require('@/models/Dao/mall/GoodsOptionGroupDao')
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

    await new Promise((resolve, reject) => {
      ctx
        .transaction(async (t) => {
          // 创建goods
          let goodsRes = await GoodsDao.create(
            {
              goodsName,
              goodsDesc,
              optionMax: options.length,
            },
            { transaction: t }
          )
          // 添加组合类
          for (let i = 0; i < options.length; i++) {
            let option = options[i]
            let optionCount = i
            // 添加父类
            let pres = await GoodsOptionDao.create(
              {
                goodsId: goodsRes.id,
                optionName: option.optionName,
                optionCount,
              },
              { transaction: t }
            )
            if (option.children && option.children.length > 0) {
              for (let j = 0; j < option.children.length; j++) {
                let item = option.children[j]
                await GoodsOptionDao.create(
                  {
                    goodsId: goodsRes.id,
                    optionName: item.optionName,
                    optionCount,
                    pid: pres.dataValues.id,
                  },
                  { transaction: t }
                )
              }
            }
          }

          if (goodsRes) {
            ctx.success({ message: '添加成功' })
          } else {
            ctx.fail({ message: '添加失败' })
          }
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    }).catch((err) => {
      throw new Error(err)
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
      attributes: ['goodsName', 'id', 'goodsDesc', 'createTime', 'optionMax'],
    })

    let allOptions = await GoodsOptionDao.findAll({
      where: {
        goodsId: id,
      },
    })

    let parentOption = allOptions
      .filter((item) => item.dataValues.pid === null)
      .map((item) => {
        return {
          id: item.dataValues.id,
          goodsId: item.dataValues.goodsId,
          optionName: item.dataValues.optionName,
          children: [],
        }
      })
    parentOption.forEach((parent) => {
      parent.children = allOptions
        .filter((item) => item.dataValues.pid === parent.id)
        .map((item) => {
          return {
            id: item.dataValues.id,
            pid: item.dataValues.pid,
            goodsId: item.dataValues.goodsId,
            optionName: item.dataValues.optionName,
          }
        })
    })

    let options = parentOption
    let goodsInfo = {
      ...goods.dataValues,
      options,
    }

    if (goods) {
      ctx.success({ data: goodsInfo })
    } else {
      ctx.fail({ message: '商品信息获取失败' })
    }
  }

  async update(ctx) {
    const { id, goodsName, goodsDesc, options } = ctx.request.body

    if (!id) {
      return ctx.fail({ message: '请传入商品id' })
    } else if (!goodsName) {
      return ctx.fail({ message: '请传入商品名称' })
    } else if (!options) {
      return ctx.fail({ message: '请传入类型组合' })
    }

    await new Promise((resolve, reject) => {
      ctx
        .transaction(async (t) => {
          // 先删除所有类型
          await GoodsOptionDao.destroy(
            {
              where: {
                goodsId: id,
              },
            },
            { transaction: t }
          )

          // 添加类型
          for (let i = 0; i < options.length; i++) {
            let option = options[i]
            let optionCount = i
            // 添加父类
            let pres = await GoodsOptionDao.create(
              {
                goodsId: id,
                optionName: option.optionName,
                optionCount,
              },
              { transaction: t }
            )
            if (option.children && option.children.length > 0) {
              for (let j = 0; j < option.children.length; j++) {
                let item = option.children[j]
                await GoodsOptionDao.create(
                  {
                    goodsId: id,
                    optionName: item.optionName,
                    optionCount,
                    pid: pres.dataValues.id,
                  },
                  { transaction: t }
                )
              }
            }
          }
          let resGoods = await GoodsDao.update(
            {
              goodsName,
              goodsDesc,
            },
            {
              where: {
                id,
              },
              transaction: t,
            }
          )
          
          if (resGoods) {
            ctx.success({ message: '修改成功' })
          } else {
            ctx.fail({ message: '修改失败' })
          }
          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    }).catch((err) => {
      throw new Error(err)
    })
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

    fs.unlinkSync(file.path)

    ctx.success({ data: file })
  }
}

module.exports = new GoodsController()
