module.exports = function(list, count, pageNum, pageSize) {
  return {
    total: count,
    current: pageNum,
    totalPage: Math.ceil(count / pageSize),
    list: list
  }
}