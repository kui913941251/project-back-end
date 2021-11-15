const path = require('path')
const fs = require('fs')
const PersonalDao = require('@/models/Dao/public/PersonalDao')
const FileDao = require('@/models/Dao/public/FileDao')
const { userRedis } = require('@/db/redis')

const FileUtils = require('@/utils/FileUtils')

class PersonalController {
  constructor() {}

  async userInfo(ctx) {
    const token = ctx.get('Authorization')

    let user = await userRedis.get(token)

    if (user) {
      let res = await PersonalDao.userInfo({ id: user.id })

      if (res.length > 0) {
        ctx.success({
          data: {
            username: res[0].username,
            createTime: res[0].create_time,
            avatar: res[0].avatar,
          },
        })
      } else {
        ctx.fail({ message: '获取用户信息失败' })
      }
    } else {
      ctx.fail({ message: '获取用户信息失败' })
    }
  }

  async importAvatar(ctx) {
    const { file } = ctx.request.files
    const { fileName, fileType } = ctx.request.body
    const token = ctx.get("Authorization")
    let user = await userRedis.get(token)

    if (!file) {
      return ctx.fail({ message: '请传入文件' })
    } else if (!fileName) {
      return ctx.fail({ message: '请传入文件名' })
    } else if (!fileType) {
      return ctx.fail({ message: '请传入文件类型' })
    }

    let fileMkd = '/file/avatar'
    let extname = path.extname(fileName)
    let hash = file.hash
    let targetFileName = hash + extname
    let filePath = path.join('/file/avatar', `/${targetFileName}`)

    let repeatVerify = await FileDao.findFileByHash({ hash })

    if (repeatVerify.length > 0) {
      return ctx.success({ message: '上传成功', data: repeatVerify[0].file_path })
    }

    FileUtils.save(file, fileMkd, filePath)

    let res = await FileDao.add({ filePath, fileName, hash, fileType: +fileType, uploader: user.id })

    if (res.affectedRows >= 1) {
      ctx.success({ message: '上传成功', data: filePath })
    } else {
      FileUtils.remove(filePath)
      ctx.fail({ message: '上传失败' })
    }
  }

  async changeAvatar(ctx) {
    const { avatarPath } = ctx.request.body
    const token = ctx.get('Authorization')

    if (!avatarPath) return ctx.fail({ message: '请传入头像url' })

    let user = await userRedis.get(token)

    if (user) {
      let res = await PersonalDao.changeAvatar({ id: user.id, avatarPath })
      if (res.affectedRows > 0) {
        ctx.success({ message: '修改成功' })
      } else {
        ctx.fail({ message: '修改失败' })
      }
    }
  }
}

module.exports = new PersonalController()
