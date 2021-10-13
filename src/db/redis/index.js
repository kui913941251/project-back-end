const Client = require("./client")

const tokenRedis = new Client({}, "Token")

const userRedis = new Client({}, "User")

const captchaRedis = new Client({}, "Captcha")

module.exports = {
  tokenRedis,
  userRedis,
  captchaRedis
}