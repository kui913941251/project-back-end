const { apiSearchByKey } = require("../../../api/index")

module.exports = async (ctx, next) => {
  let {keyword} = ctx.query
  let res = await apiSearchByKey(
    {
      pageNum: 1,
      pageSize: 20,
      keyword
    }
  )
  ctx.success({
    data: res.data
  }) 
}
