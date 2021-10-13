const config = require('./config')
const redis = require('redis')

let client = null

function createRedisClient() {
  client = redis.createClient({
    host: config.HOST,
    port: config.PORT,
    password: config.PASSWORD,
  })
  return client
}
class Client {
  constructor(options = {}, type = '') {
    this.redis = client || createRedisClient()
    this.type = type
    this.keyStart = type ? type + '-' : ''
    this.options = {
      timeout: 1 * 24 * 60 * 60, // 默认一天
      ...options,
    }
  }

  async set(key, val) {
    try {
      return await this.redis.set(this.keyStart + key, JSON.stringify(val))
    } catch (err) {
      console.error(this.type + ' redis:set Error'.red, err)
    }
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      try {
        this.redis.get(this.keyStart + key, function (err, res) {
          // if (res.time && Date.now() - res.time > this.options.timeout - 10) {
          //   this.destroy(this.type + key)
          //   resolve(null)
          // } else {
          //   resolve(res)
          // }
          resolve(JSON.parse(res))
        })
      } catch (err) {
        console.error(this.type + ' redis:get Error'.red, err)
      }
    })
  }

  async destroy(key) {
    try {
      return await this.redis.del(this.keyStart + key)
    } catch (err) {
      console.error(this.type + ' redis:destroy Error'.red, err)
    }
  }

  expire(...arg) {
    return this.redis.expire(arg)
  }
}

module.exports = Client
