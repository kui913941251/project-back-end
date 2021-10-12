const request = require("../../../utils/request");

function apiMusicUrl(params) {
  const data = {
    comm: {
      cv: 4747474,
      ct: 24,
      format: "json",
      inCharset: "utf-8",
      outCharset: "utf-8",
      notice: 0,
      platform: "yqq.json",
      needNewCode: 1,
      uin: 0,
      g_tk_new_20200303: 5381,
      g_tk: 5381,
    },
    req_1: {
      module: "vkey.GetVkeyServer",
      method: "CgiGetVkey",
      param: {
        guid: "2185556768",
        songmid: [params.songmid],
        songtype: [0],
        uin: "0",
        loginflag: 1,
        platform: "20",
      },
    },
  };
  return request({
    url: "https://u.y.qq.com/cgi-bin/musicu.fcg",
    method: "post",
    data: data,
  })
}

module.exports = apiMusicUrl;
