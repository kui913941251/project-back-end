const { apiSearchByKey } = require("../../../api/index")


module.exports = async (ctx, next) => {
  let res = await apiSearchByKey(
    {
      pageNum: 1,
      pageSize: 10,
      keyword: "周杰伦"
    }
  )
  ctx.success({
    data: res
  }) 
  next()
}
