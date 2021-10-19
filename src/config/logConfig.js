const path = require('path')

// 日志根目录
const basePath = path.join(process.cwd(), '/src/logs')
console.log(basePath)

const errorPath = '/error'
const errorLogName = 'error'
const errorLogPath = path.join(basePath, errorPath, errorLogName)

module.exports = {
  appenders: {
    defaultLogger: { type: 'console' },
    errorLogger: {
      type: 'dateFile',
      filename: errorLogPath,
      pattern: '-yyyy-MM-dd.log',
      alwaysIncludePattern: true,
      encoding: 'utf-8',
      path: errorPath,
    },
  },
  categories: {
    default: { appenders: ['defaultLogger'], level: 'all' },
    errorLogger: {
      appenders: ['errorLogger'],
      level: 'error',
    },
  },
}
