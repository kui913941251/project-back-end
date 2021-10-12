const UserDao = require('@/models/Dao/UserDao')

const pageUtil = require('@/utils/pageUtil')

class UserController {
  constructor() {}
  async login(ctx, next) {
    const { username, password } = ctx.request.body
    if (!username) {
      return ctx.fail({ message: '请传入用户名' })
    } else if (!password) {
      return ctx.fail({ message: '请传入密码' })
    }

    let user = await UserDao.login(username, password)
    if (user.length === 1) {
      ctx.success({
        message: '登录成功',
      })
    } else {
      ctx.fail({ message: '用户名或密码错误' })
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
      console.log(res)
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
