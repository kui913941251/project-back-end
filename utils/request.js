const axios = require("axios")

const instance = axios.create()

instance.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

function request(config) {

  instance.interceptors.response.use(function(response) {
    console.log("------------------");
    console.log(response.data);
    console.log("------------------");
    return response.data
  })

  return instance(config)
}

module.exports = request