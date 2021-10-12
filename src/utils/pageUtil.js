module.exports = function(sqlData, pageNum, pageSize) {
  const count = sqlData[0][0]["count(*)"]
  return {
    total: count,
    current: pageNum,
    totalPage: Math.ceil(count / pageSize),
    list: sqlData[1]
  }
}