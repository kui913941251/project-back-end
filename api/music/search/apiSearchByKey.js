const request = require("../../../utils/request");

function apiSearchByKey(params) {
  return request({
    url: "https://c.y.qq.com/soso/fcgi-bin/client_search_cp",
    params: {
      p: params.pageNum,
      n: params.pageSize,
      w: params.keyword,
      format: "json",
      t: params.type  // t: 0 单曲, 8 专辑, 7 歌词, 12 mv
    },
  });
}

module.exports = apiSearchByKey;
