const { apiSearchByKey } = require("../../../api/index")


module.exports = async (ctx, next) => {
  let res = await apiSearchByKey(
    {
      pageNum: 1,
      pageSize: 10,
      keyword: "周"
    }
  )
  ctx.success({
    data: 'res.data'
  }) 
  console.log("------------");
  next()
}
