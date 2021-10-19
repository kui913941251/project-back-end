const LogUtils = require('@/utils/LogUtils')

const catchError = async (ctx, next) => {
  try {
    await next()
  } catch (err) {
    console.log(err)
    LogUtils.logError(ctx, err)
    ctx.fail({ message: 'something is error' })
  }
}

module.exports = catchError
