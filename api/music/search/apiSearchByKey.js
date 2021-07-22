const request = require("../../../utils/request")

function aetSearchByKey(params) {
  return request({
    url: "https://c.y.qq.com/soso/fcgi-bin/client_search_cp",
    params: {
      p: params.pageNum,
      n: params.pageSize,
      w: params.keyword,
      format: "json"
    }
  })
}

module.exports = aetSearchByKey