const catchError = async (ctx,next)=>{
  try{
      await next()
  } catch(error){
      if(error.errorCode){
          return ctx.body = error.msg
      }
  }
}

module.exports = catchError