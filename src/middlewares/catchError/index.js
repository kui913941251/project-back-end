const LogUtils = require('@/utils/LogUtils')

const catchError = async (ctx, next) => {
  let startTime = Date.now()
  let resTime
  try {
    await next()
  } catch (err) {
    console.log(err)
    resTime = Date.now() - startTime
    LogUtils.logError(ctx, err, resTime)
    ctx.fail({ message: 'something is error' })
  }
}

module.exports = catchError
