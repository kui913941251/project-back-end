const AuthDao = require('@/models/Dao/AuthDao')

async function getAuthTreeByPid(pid = null) {
  let res = await AuthDao.tree({ pid })
  if (res && res.length > 0) {
    let arr = []
    for (let i = 0; i < res.length; i++) {
      let auth = {
        ...res[i],
        children: await getAuthTreeByPid(res[i].id),
      }
      arr.push(auth)
    }
    return arr
  } else {
    return []
  }
}

class AuthController {
  constructor() {}

  async tree(ctx) {
    let { pid = null } = ctx.request.body

    let res = await getAuthTreeByPid(pid)

    ctx.success({ data: res })
  }

  async add(ctx) {
    let { authName, authCode, pid } = ctx.request.body
    if (!authName) {
      return ctx.fail({ message: '请传入权限名称' })
    } else if (!authCode) {
      return ctx.fail({ message: '请传入权限标识' })
    }

    let res = await AuthDao.add({ authName, authCode, pid })

    if (res.affectedRows === 1) {
      ctx.success({ message: '添加成功' })
    } else {
      ctx.fail({ message: '添加失败' })
    }
  }


}

module.exports = new AuthController()
