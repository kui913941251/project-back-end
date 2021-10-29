const fs = require('fs')
const path = require('path')

const FileDao = require('@/models/Dao/public/FileDao')

class FileController {
  constructor() {}

  async import(ctx) {
    const { file } = ctx.request.files
    const { fileName } = ctx.request.body
    let pathUrl = path.join(process.cwd(), '/static')

    pathUrl = path.join(pathUrl, 'file')

    let filePath = path.join(pathUrl, `/${file.name}`)

    if (!fs.existsSync(pathUrl)) {
      fs.mkdirSync(pathUrl)
    }

    const readerStream = fs.createReadStream(file.path)
    const wirteStream = fs.createWriteStream(filePath)
    readerStream.pipe(wirteStream)

    let targetFileName = fileName || file.name
    let res = await FileDao.add({ path: filePath, fileName: targetFileName })

    if (res.affectedRows >= 1) {
      ctx.success({ message: '上传成功', data: filePath })
    } else {
      fs.unlinkSync(filePath)
      ctx.fail({ message: '上传失败' })
    }
  }

  async delete(ctx) {
    const { fileId } = ctx.request.body
    if (!fileId) {
      return ctx.fail({ message: '请传入文件id' })
    }

    let fileRes = await FileDao.findFile({ fileId })
    let file = null
    if (fileRes && fileRes.length > 0) {
      file = fileRes[0]
    } else {
      return ctx.fail({ message: '该文件不存在' })
    }

    let res = await FileDao.delete({ fileId })
    if (res.affectedRows >= 1) {
      fs.unlinkSync(file.filePath)
      ctx.success({ message: '删除成功' })
    } else {
      ctx.fail({ message: '删除失败' })
    }
  }
}

module.exports = new FileController()
