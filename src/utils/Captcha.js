const svgCaptcha = require('svg-captcha')

module.exports = function generateCaptcha() {
  return svgCaptcha.create({
    size: 4, // 验证码长度
    ignoreChars: '0oO1ilI', // 验证码字符中排除 0oO1ilI
    noise: 2, // 干扰线条的数量
    width: 160,
    height: 50,
    fontSize: 50,
    color: true, // 验证码的字符是否有颜色，默认没有，如果设定了背景，则默认有
    background: '#eee',
  })
}
