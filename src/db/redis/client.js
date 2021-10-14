const config = require('./config')
const redis = require('redis')

let client = null

function createRedisClient() {
  client = redis.createClient({
    host: config.HOST,
    port: config.PORT,
    password: config.PASSWORD,
  })

  client.on('error', function (err) {
    console.log('Error: ' + err.stack)
  })

  return client
}
class Client {
  constructor(options = {}, type = '') {
    this.redis = client || createRedisClient()
    this.type = type
    this.keyStart = type ? type + '-' : ''
    this.options = { ...options }
  }

  async set(key, val) {
    try {
      return await this.redis.set(this.keyStart + key, JSON.stringify(val))
    } catch (err) {
      console.error(this.type + ' redis:set Error'.red, err)
    }
  }

  async setex(key, seconds, val) {
    return new Promise((resolve, reject) => {
      try {
        this.redis.setex(this.keyStart + key, seconds, JSON.stringify(val), function (err) {
          if (err) {
            reject(err)
          } else {
            resolve(true)
          }
        })
      } catch (err) {
        console.error(this.type + ' redis:setex Error'.red, err)
      }
    })
  }

  async get(key) {
    return new Promise((resolve, reject) => {
      try {
        this.redis.get(this.keyStart + key, function (err, res) {
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

  async expire(key, time) {
    try {
      return await this.redis.expire(this.keyStart + key, time)
    } catch (err) {
      console.error(this.type + ' redis:expire Error'.red, err)
    }
  }
}

module.exports = Client
