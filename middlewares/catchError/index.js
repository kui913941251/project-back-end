const catchError = async (ctx, next) => {
  try {
    await next();
  } catch (err) {
    console.log(err);
  }
};

module.exports = catchError;
