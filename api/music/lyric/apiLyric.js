const request = require("../../../utils/request");

const dParams = {
  // _: "1628228830007",
  // cv: "4747474",
  // ct: "24",
  format: "json",
  // inCharset: "utf-8",
  // outCharset: "utf-8",
  // notice: "0",
  // platform: "yqq.json",
  // needNewCode: "1",
  // uin: "0",
  // g_tk_new_20200303: "5381",
  // g_tk: "5381",
  // loginUin: "0",
};

function apiLyric(params) {
  return request({
    url: "https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg",
    params: {
      ...dParams,
      songmid: params.songmid,
      // musicid: params.musicid
    },
    headers: {
      origin: "https://y.qq.com",
      referer: "https://y.qq.com/",
    },
  });
}

module.exports = apiLyric;
