const moment = require("moment")

function formatDate(val, format) {
  return moment(val, format)
}

module.exports = {
  formatDate
}