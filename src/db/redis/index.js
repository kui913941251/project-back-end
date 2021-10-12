const config = require("./config")
const redis = require("redis")

const client = redis.createClient({
  host: config.HOST,
  port: config.PORT,
  password: config.PASSWORD
});


// client.set("mykey", "123123123123123", () => {
//   console.log("success");
//   client.end()
// })


module.exports = client