const UserDao = require('@/models/Dao/UserDao')
const PageUtil = require('@/utils/PageUtil')
const { getToken, encryptedPassword } = require('@/utils/AuthUtils')
const { tokenRedis, userRedis, captchaRedis } = require('@/db/redis')
const generateCaptcha = require('@/utils/captcha')
const expires = 3600 * 24 * 1 // 默认一天

class UserController {
  constructor() {}
  async login(ctx, next) {
    const { username, password, captcha } = ctx.request.body
    if (!username) {
      return ctx.fail({ message: '请传入用户名' })
    } else if (!password) {
      return ctx.fail({ message: '请传入密码' })
    } else if (!captcha) {
      return ctx.fail({ message: '请传入验证码' })
    }

    // let saveCaptcha = await captchaRedis.get(username)
    // if (saveCaptcha !== captcha.toLowerCase()) {
    //   ctx.fail({ message: '验证码不正确' })
    //   return
    // }

    let res = await UserDao.login({ username, password: encryptedPassword(password) })
    if (res.length === 1) {
      let user = res[0]
      // 获取上次用户登录的token，存在则清除
      let preToken = await tokenRedis.get(user.username)
      preToken && userRedis.destroy(preToken)
      // redis记录用户登录信息
      let token = getToken(user.id)
      user.expires = Date.now() + expires * 1000
      user.token = token
      // 获取用户权限
      let authList = await UserDao.getUserAuthList({ userId: user.id })
      user.authList = authList && authList.map((item) => item.auth_code)
      let userSetRes = await userRedis.setex(token, expires, user).catch((err) => {
        console.log(err)
      })
      if (!userSetRes) {
        return ctx.fail({ message: '登录失败' })
      }
      // redis记录当前用户登录的token
      let tokenSetRes = await tokenRedis.setex(user.username, expires, token).catch((err) => {
        console.log(err)
      })
      if (!tokenSetRes) {
        return ctx.fail({ message: '登录失败' })
      }
      captchaRedis.destroy(username)
      ctx.success({
        message: '登录成功',
        data: {
          username: user.username,
          authList: user.authList,
          token
        },
      })
    } else {
      ctx.fail({ message: '用户名或密码错误' })
    }
  }

  async captcha(ctx) {
    let { username } = ctx.request.query
    if (!username) {
      return ctx.fail({ message: '请传入用户名' })
    }
    let captcha = generateCaptcha()
    let setRes = await captchaRedis.setex(username, 60, captcha.text.toLowerCase()).catch((err) => {
      throw err
    })
    if (setRes) {
      ctx.body = captcha.data
    } else {
      ctx.fail({ message: '验证码生成失败' })
    }
  }

  async logout(ctx, next) {
    let token = ctx.get('Authorization')
    if (!token) {
      ctx.fail({ message: '请传入token' })
    } else {
      let user = await tokenRedis.get(token)
      if (!user) {
        ctx.fail({ message: '请传入正确的token' })
      } else {
        tokenRedis.destroy(user.token)
        userRedis.destroy(user.username)
        ctx.success({ message: '退出成功' })
      }
      console.log(user)
    }
  }

  async registerUser(ctx, next) {
    try {
      const { username, password } = ctx.request.body

      if (!username) {
        return ctx.fail({ message: '请传入用户名' })
      } else if (!password) {
        return ctx.fail({ message: '请传入密码' })
      }

      let userRes = await UserDao.findUserByName({ username })

      if (userRes && userRes.length !== 0) {
        return ctx.fail({ message: '用户名已存在' })
      }

      let res = await UserDao.register({ username, password: encryptedPassword(password) })

      if (res.affectedRows === 1) {
        ctx.success({
          message: '注册成功',
        })
      } else {
        ctx.fail({ message: '注册失败' })
      }
    } catch (error) {
      console.log(error)
    }
  }

  async userList(ctx) {
    const { pageNum = 1, pageSize = 10 } = ctx.request.body

    let res = await UserDao.userList({ pageNum, pageSize })

    if (res.length === 2) {
      ctx.success({ data: PageUtil(res, pageNum, pageSize) })
    }
  }

  async deleteUser(ctx) {
    const { userId } = ctx.request.body

    if (!userId) {
      return ctx.fail({ message: '请传入用户id' })
    }

    let userRes = await UserDao.findUserById({ userId })

    if (userRes && userRes.length === 0) {
      return ctx.fail({ message: '该用户不存在' })
    }

    let user = userRes[0]

    let res = await UserDao.deleteUser({ userId: user.id })

    if (res.affectedRows === 1) {
      ctx.success({ message: '删除成功' })
    } else {
      ctx.fail({ message: '删除失败' })
    }
  }

  async bindRole(ctx) {
    const { userId, roleIdList = [] } = JSON.parse(ctx.request.body)
    if (!userId) {
      return ctx.fail({ message: '请传入用户id' })
    } else if (!Array.isArray(roleIdList)) {
      return ctx.fail({ message: '请传入角色id数组' })
    }
    let res = await UserDao.bindRole({ userId, roleIdList })
    if (res) {
      ctx.success({ message: '绑定成功' })
    } else {
      ctx.fail({ message: '绑定失败' })
    }
  }
}

module.exports = new UserController()
