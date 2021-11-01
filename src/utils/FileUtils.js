const path = require('path')
const fs = require('fs')
let staticPath = '/static'

function save(file, fileMkd, filePath) {
  let fileFullName = filePath.slice(filePath.lastIndexOf('/') + 1)
  if (fileFullName.indexOf('.') === -1) {
    throw new Error('文件名格式不正确')
  }
  let baseUrl = path.join(process.cwd(), staticPath)
  if (!fs.existsSync(baseUrl)) {
    fs.mkdirSync(baseUrl)
  }
  fs.mkdirSync(path.join(baseUrl, fileMkd), { recursive: true })
  const readerStream = fs.createReadStream(file.path)
  const wirteStream = fs.createWriteStream(path.join(baseUrl, filePath))
  readerStream.pipe(wirteStream)
}

function remove(filePath) {
  let baseUrl = path.join(process.cwd(), staticPath)
  fs.unlinkSync(path.join(baseUrl, filePath))
}

module.exports = {
  save,
  remove
}
