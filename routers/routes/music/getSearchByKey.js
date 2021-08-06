const { apiMusicSearchByKey } = require("../../../api/index")

module.exports = async (ctx, next) => {
  let {keyword, pageNum, pageSize} = ctx.query
  let res = await apiMusicSearchByKey(
    {
      pageNum: pageNum || 1,
      pageSize: pageSize || 10,
      keyword: keyword || "周杰伦"
    }
  )
  ctx.success({
    data: res.data
  }) 
}
