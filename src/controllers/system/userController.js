const UserDao = require('@/models/Dao/system/UserDao')
const PageUtil = require('@/utils/PageUtil')
const { getToken, encryptedPassword } = require('@/utils/AuthUtils')
const { tokenRedis, userRedis, captchaRedis } = require('@/db/redis')
const generateCaptcha = require('@/utils/captcha')
const expires = 3600 * 24 * 1 // 默认一天

class UserController {
  constructor() {}
  async register(ctx) {
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
  }

  async login(ctx) {
    const { username, password, captcha } = ctx.request.body
    if (!username) {
      return ctx.fail({ message: '请传入用户名' })
    } else if (!password) {
      return ctx.fail({ message: '请传入密码' })
    } else if (!captcha) {
      return ctx.fail({ message: '请传入验证码' })
    }

    let saveCaptcha = await captchaRedis.get(username)
    if (saveCaptcha !== captcha.toLowerCase()) {
      ctx.fail({ message: '验证码不正确' })
      return
    }

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
      let authList = await UserDao.getUserAuthList({ id: user.id })
      user.authCodeList = authList && authList.map((item) => item.auth_code)
      let userSetRes = await userRedis.setex(token, expires, user).catch((err) => {
        throw err
      })
      if (!userSetRes) {
        return ctx.fail({ message: '登录失败' })
      }
      // redis记录当前用户登录的token
      let tokenSetRes = await tokenRedis.setex(user.username, expires, token).catch((err) => {
        throw err
      })
      if (!tokenSetRes) {
        return ctx.fail({ message: '登录失败' })
      }
      captchaRedis.destroy(username)
      ctx.success({
        message: '登录成功',
        data: {
          username: user.username,
          authCodeList: user.authCodeList,
          token,
          avatar: user.avatar,
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

  async logout(ctx) {
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
    }
  }

  async info(ctx) {
    let token = ctx.get('Authorization')
    let user = await userRedis.get(token)

    let res = await UserDao.findUserById({ id: user.id })

    if (res.length > 0) {
      ctx.success({
        data: {
          username: res[0].username,
          authCodeList: user.authCodeList,
          token: user.token,
          avatar: res[0].avatar,
        },
      })
    }
  }

  async add(ctx) {
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
        message: '添加成功',
      })
    } else {
      ctx.fail({ message: '添加失败' })
    }
  }

  async userList(ctx) {
    const { pageNum = 1, pageSize = 10, username = '' } = ctx.request.body

    let res = await UserDao.userList({ pageNum, pageSize, username })

    if (res.length === 2) {
      ctx.success({ data: PageUtil(res[1], res[0][0]["count(*)"], pageNum, pageSize) })
    }
  }

  async update(ctx) {
    const { username, id, password } = ctx.request.body
    if (!username) {
      return ctx.fail({ message: '请传入用户名' })
    } else if (!id) {
      return ctx.fail({ message: '请传入用户id' })
    } else if (!password) {
      return ctx.fail({ message: '请传入密码' })
    }

    const res = await UserDao.update({ username, id, password: encryptedPassword(password) })

    if (res.affectedRows > 0) {
      ctx.success({ message: '修改成功' })
    } else {
      ctx.fail({ message: '修改失败' })
    }
  }

  async deleteUser(ctx) {
    const { id } = ctx.request.body

    if (!id) {
      return ctx.fail({ message: '请传入用户id' })
    }

    let userRes = await UserDao.findUserById({ id })

    if (userRes && userRes.length === 0) {
      return ctx.fail({ message: '该用户不存在' })
    }

    let user = userRes[0]

    let res = await UserDao.deleteUser({ id: user.id })

    if (res.affectedRows === 1) {
      ctx.success({ message: '删除成功' })
    } else {
      ctx.fail({ message: '删除失败' })
    }
  }

  async bindRole(ctx) {
    const { id, roleIdList = [] } = JSON.parse(ctx.request.body)
    if (!id) {
      return ctx.fail({ message: '请传入用户id' })
    } else if (!Array.isArray(roleIdList)) {
      return ctx.fail({ message: '请传入角色id数组' })
    }
    let res = await UserDao.bindRole({ id, roleIdList })
    if (res) {
      ctx.success({ message: '绑定成功' })
    } else {
      ctx.fail({ message: '绑定失败' })
    }
  }
}

module.exports = new UserController()
