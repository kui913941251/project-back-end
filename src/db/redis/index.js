const Client = require("./client")

const tokenRedis = new Client({}, "Token")

const userRedis = new Client({}, "User")


module.exports = {
  tokenRedis,
  userRedis
}