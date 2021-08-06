const { apiMusicUrl } = require("../../../api/index");

module.exports = async (ctx, next) => {
  let {songmid} = ctx.query
  let res = await apiMusicUrl({
    songmid,
  });
  let info = res.data.req_1.data
  let url = `${info.sip[0]}${info.midurlinfo[0].filename}?guid=2185556768&vkey=${info.midurlinfo[0].vkey}&uin=&fromtag=66`;
  console.log(info);
  ctx.success({
    data: url,
  });
};
