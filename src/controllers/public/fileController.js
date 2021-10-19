const fs = require('fs')
const path = require('path')

const FileDao = require('@/models/Dao/FileDao')

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
      ctx.fail({ message: '上传失败' })
    }
  }
}

module.exports = new FileController()
