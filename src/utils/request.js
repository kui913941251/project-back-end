const axios = require("axios")

const instance = axios.create()

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

function request(config) {

  instance.interceptors.response.use(function(response) {
    return response
  }, function(err) {
    console.log(err);
    return err
  })

  return instance(config)
}

module.exports = request