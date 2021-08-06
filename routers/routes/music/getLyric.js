const { apiMusicLyric } = require("../../../api/index");

module.exports = async (ctx, next) => {
  // let { keyword, pageNum, pageSize } = ctx.query;
  let res = await apiMusicLyric({
    songmid: "00394z9S2ciPAD",
    musicid: '203861946',
  });
  // res.data.lyric = new Buffer(res.data.lyric, "base64").toString()
  // res.data.trans = new Buffer(res.data.trans, "base64").toString()
  ctx.success({
    data: res.data,
  });
};
