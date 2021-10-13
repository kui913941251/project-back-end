const UserDao = require('@/models/Dao/UserDao')
const pageUtil = require('@/utils/pageUtil')
const { getToken } = require('@/utils/AuthUtils')
const { tokenRedis, userRedis } = require('@/db/redis')
const expires = 3600 * 24 * 1 // 默认一天

class UserController {
  constructor() {}
  async login(ctx, next) {
    const { username, password } = ctx.request.body
    if (!username) {
      return ctx.fail({ message: '请传入用户名' })
    } else if (!password) {
      return ctx.fail({ message: '请传入密码' })
    }
    let res = await UserDao.login(username, password)
    if (res.length === 1) {
      let user = res[0]
      // 获取上次用户登录的token
      let userLoginInfo = await userRedis.get(user.username)
      userLoginInfo && tokenRedis.destroy(userLoginInfo.token)
      // redis设置token
      let token = getToken(user.id)
      user.expires = Date.now() + expires * 1000
      user.token = token
      tokenRedis.set(token, user)
      tokenRedis.expire(token, expires)
      // redis记录当前用户登录的token
      userRedis.set(user.username, {
        token,
        ...user,
      })
      userRedis.expire(user.username, expires)
      ctx.success({
        message: '登录成功',
        data: token,
      })
    } else {
      ctx.fail({ message: '用户名或密码错误' })
    }
  }

  async logout(ctx, next) {
    let token = ctx.get("Authorization")
    if (!token) {
      ctx.fail({message: "请传入token"})
    }else {
      let user = await tokenRedis.get(token)
      if (!user) {
        ctx.fail({message: "请传入正确的token"})
      }else {
        tokenRedis.destroy(user.token)
        userRedis.destroy(user.username)
        ctx.success({message: "退出成功"})
      }
      console.log(user);
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

      let user = await UserDao.findUser(username)

      if (user.length !== 0) {
        return ctx.fail({ message: '用户名已存在' })
      }

      let res = await UserDao.register(username, password)

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

    try {
      let res = await UserDao.userList(pageNum, pageSize)

      if (res.length === 2) {
        ctx.success({ data: pageUtil(res, pageNum, pageSize) })
      }
    } catch (error) {}
  }

  async deleteUser(ctx) {
    const { username } = ctx.request.body

    if (!username) {
      return ctx.fail({ message: '请传入用户名' })
    }

    let user = await UserDao.findUser(username)

    if (user.length === 0) {
      return ctx.fail({ message: '该用户不存在' })
    }

    let res = await UserDao.deleteUser(username)

    if (res.affectedRows === 1) {
      ctx.success({ message: '删除成功' })
    } else {
      ctx.fail({ message: '删除失败' })
    }
  }
}

module.exports = new UserController()
