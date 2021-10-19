const log4js = require('log4js')
const logConfig = require('@/config/logConfig')

log4js.configure(logConfig)

const errorLogger = log4js.getLogger('errorLogger')

const formatText = {
  request: function (req, resTime) {
    var logText = new String()
    var method = req.method
    //访问方法
    logText += 'request method: ' + method + '\n'
    //请求原始地址
    logText += 'request originalUrl:  ' + req.originalUrl + '\n'
    //客户端ip
    logText += 'request client ip:  ' + req.ip + '\n'
    //开始时间
    var startTime
    //请求参数
    if (method === 'GET') {
      logText += 'request query:  ' + JSON.stringify(req.query) + '\n'
      // startTime = req.query.requestStartTime;
    } else {
      logText += 'request body: ' + '\n' + JSON.stringify(req.body) + '\n'
      // startTime = req.body.requestStartTime;
    }
    //服务器响应时间
    logText += 'response time: ' + resTime + '\n'
    return logText
  },
  error: function (ctx, err, resTime) {
    var logText = new String()
    //错误信息开始
    logText += '\n' + '*************** error log start ***************' + '\n'
    //添加请求日志
    logText += formatText.request(ctx.request, resTime)
    //错误名称
    logText += 'err name: ' + err.name + '\n'
    //错误信息
    logText += 'err message: ' + err.message + '\n'
    //错误详情
    logText += 'err stack: ' + err.stack + '\n'
    //错误信息结束
    logText += '*************** error log end ***************' + '\n'
    return logText
  },
}

module.exports = {
  //封装错误日志
  logError: function (ctx, error, resTime) {
    if (ctx && error) {
      errorLogger.error(formatText.error(ctx, error, resTime))
    }
  },
}
