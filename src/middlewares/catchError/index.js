const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(err);
    ctx.fail({message: "something is error"})
  }
};

module.exports = catchError;
