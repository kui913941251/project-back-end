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

    let list = res.rows.map((item) => {
      return {
        ...item.dataValues,
      }
    })

    for (let i = 0; i < list.length; i++) {
      let item = list[i]
      let allOptions = await GoodsOptionDao.findAll({
        where: {
          goodsId: item.id,
        },
      })
      let parentOption = allOptions
        .filter((item) => item.pid === null)
        .map((item) => {
          return {
            id: item.id,
            goodsId: item.goodsId,
            optionName: item.optionName,
            children: [],
          }
        })
      parentOption.forEach((parent) => {
        parent.children = allOptions
          .filter((item) => item.pid === parent.id)
          .map((item) => {
            return {
              id: item.id,
              pid: item.pid,
              goodsId: item.goodsId,
              optionName: item.optionName,
            }
          })
      })
      item.options = parentOption

      let groupList = await GoodsOptionGroupDao.findAll({
        where: {
          goodsId: item.id,
        },
      })
      item.groupList = groupList.map((group) => {
        let res = group.dataValues
        return {
          id: res.id,
          goodsId: res.goodsId,
          compose: res.groupIds.split(',').map(item => +item),
          stocks: res.stocks,
          price: res.price,
        }
      })
    }

    ctx.success({ data: PageUtil(list, res.count, pageNum, pageSize) })
  }

  async add(ctx) {
    const { goodsName, goodsDesc, options } = ctx.request.body

    if (!goodsName) {
      return ctx.fail({ message: '?????????????????????' })
    } else if (!options) {
      return ctx.fail({ message: '?????????????????????' })
    }

    let existGoods = await GoodsDao.findOne({
      where: {
        goodsName,
      },
    })

    if (existGoods) {
      return ctx.fail({ message: '???????????????????????????' })
    }

    await new Promise((resolve, reject) => {
      ctx
        .transaction(async (t) => {
          // ??????goods
          let goodsRes = await GoodsDao.create(
            {
              goodsName,
              goodsDesc,
              optionMax: options.length,
            },
            { transaction: t }
          )
          // ???????????????
          for (let i = 0; i < options.length; i++) {
            let option = options[i]
            let optionCount = i
            // ????????????
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
            ctx.success({ message: '????????????' })
          } else {
            ctx.fail({ message: '????????????' })
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
      return ctx.fail({ message: '???????????????id' })
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
      ctx.fail({ message: '????????????????????????' })
    }
  }

  async update(ctx) {
    const { id, goodsName, goodsDesc, options } = ctx.request.body

    if (!id) {
      return ctx.fail({ message: '???????????????id' })
    } else if (!goodsName) {
      return ctx.fail({ message: '?????????????????????' })
    } else if (!options) {
      return ctx.fail({ message: '?????????????????????' })
    }

    await new Promise((resolve, reject) => {
      ctx
        .transaction(async (t) => {
          // ?????????????????????
          await GoodsOptionDao.destroy(
            {
              where: {
                goodsId: id,
              },
            },
            { transaction: t }
          )

          // ????????????
          for (let i = 0; i < options.length; i++) {
            let option = options[i]
            let optionCount = i
            // ????????????
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
            ctx.success({ message: '????????????' })
          } else {
            ctx.fail({ message: '????????????' })
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
      return ctx.fail({ message: '???????????????id' })
    }

    let res = await GoodsDao.destroy({
      where: {
        id,
      },
    })

    if (res === 1) {
      ctx.success({ message: '????????????' })
    } else {
      ctx.fail({ message: '????????????' })
    }
  }

  async import(ctx) {
    const { file } = ctx.request.files
    const { fileType } = ctx.request.body

    if (!file) {
      return ctx.fail({ message: '???????????????' })
    } else if (!fileType) {
      return ctx.fail({ message: '?????????????????????' })
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

  async addGroup(ctx) {
    const { id, groupList } = ctx.request.body
    if (!id) {
      return ctx.fail({ message: '???????????????id' })
    } else if (!groupList) {
      return ctx.fail({ message: '?????????????????????' })
    }

    await new Promise((resolve, reject) => {
      ctx
        .transaction(async (t) => {
          await GoodsOptionGroupDao.destroy(
            {
              where: {
                goodsId: id,
              },
            },
            {
              transaction: t,
            }
          )

          for (let i = 0; i < groupList.length; i++) {
            let item = groupList[i]
            await GoodsOptionGroupDao.create(
              {
                goodsId: id,
                groupIds: item.compose.join(','),
                stocks: item.stocks,
                price: item.price,
              },
              {
                transaction: t,
              }
            )
          }

          ctx.success({ message: '????????????' })

          resolve()
        })
        .catch((err) => {
          reject(err)
        })
    }).catch((err) => {
      throw new Error(err)
    })
  }
}

module.exports = new GoodsController()
