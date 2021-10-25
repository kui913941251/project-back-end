const AuthDao = require('@/models/Dao/AuthDao')

async function getAuthTreeByPid(pid = null) {
  let res = await AuthDao.findAuthByPid({ pid })
  if (res && res.length > 0) {
    let arr = []
    for (let i = 0; i < res.length; i++) {
      let auth = {
        id: res[i].id,
        authCode: res[i].auth_code,
        authName: res[i].auth_name,
        des: res[i].des,
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

  async update(ctx) {
    let { authName, authCode, authId } = ctx.request.body
    if (!authName) {
      return ctx.fail({ message: '请传入权限名称' })
    } else if (!authCode) {
      return ctx.fail({ message: '请传入权限标识' })
    } else if (!authId) {
      return ctx.fail({ message: '请传入权限id' })
    }

    let res = await AuthDao.update({ authName, authCode, authId })

    if (res.affectedRows === 1) {
      ctx.success({ message: '修改成功' })
    } else {
      ctx.fail({ message: '修改失败' })
    }
  }

  async delete(ctx) {
    let { authId } = ctx.request.body
    if (!authId) {
      return ctx.fail({ message: '请传入权限id' })
    }
    let childAuth = await AuthDao.findAuthByPid({ pid: authId })
    if (childAuth.length > 0) {
      return ctx.fail({ message: '该权限存在子权限，无法删除' })
    } else {
      let res = await AuthDao.delete({ authId })

      if (res.affectedRows >= 1) {
        ctx.success({ message: '删除成功' })
      } else {
        return ctx.fail({ message: '删除失败' })
      }
    }
  }
}

module.exports = new AuthController()
