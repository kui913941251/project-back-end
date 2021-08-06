// public
const userLogin = require("./public/userLogin")
const userRegister = require("./public/userRegister")
const userDelete = require("./public/userDelete")
const userList = require("./public/userList")

// music
const searchByKey = require("./music/getSearchByKey")
const musicLyric = require("./music/getLyric")
const musicUrl = require("./music/getMusicUrl")


module.exports = {
  userLogin,
  userRegister,
  userDelete,
  userList,
  searchByKey,
  musicLyric,
  musicUrl
}