const AuthDao = require('@/models/Dao/system/AuthDao')

async function getAuthTreeByPid(pid = null) {
  let res = await AuthDao.findAuthByPid({ pid })
  if (res && res.length > 0) {
    let arr = []
    for (let i = 0; i < res.length; i++) {
      let auth = {
        id: res[i].id,
        authCode: res[i].auth_code,
        authName: res[i].auth_name,
        level: res[i].level,
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
    let { authName, authCode, level, pid } = ctx.request.body
    if (!authName) {
      return ctx.fail({ message: '请传入权限名称' })
    } else if (!authCode) {
      return ctx.fail({ message: '请传入权限标识' })
    } else if (!level) {
      return ctx.fail({ message: '请传入权限层级' })
    } else if ([1, 2, 3].indexOf(+level) === -1) {
      return ctx.fail({ message: '请传入正确的权限层级' })
    }

    let res = await AuthDao.add({ authName, authCode, level, pid })

    if (res.affectedRows === 1) {
      ctx.success({ message: '添加成功' })
    } else {
      ctx.fail({ message: '添加失败' })
    }
  }

  async update(ctx) {
    let { authName, authCode, id } = ctx.request.body
    if (!authName) {
      return ctx.fail({ message: '请传入权限名称' })
    } else if (!authCode) {
      return ctx.fail({ message: '请传入权限标识' })
    } else if (!id) {
      return ctx.fail({ message: '请传入权限id' })
    }

    let res = await AuthDao.update({ authName, authCode, id })

    if (res.affectedRows === 1) {
      ctx.success({ message: '修改成功' })
    } else {
      ctx.fail({ message: '修改失败' })
    }
  }

  async delete(ctx) {
    let { id } = ctx.request.body
    if (!id) {
      return ctx.fail({ message: '请传入权限id' })
    }
    let childAuth = await AuthDao.findAuthByPid({ pid: id })
    if (childAuth.length > 0) {
      return ctx.fail({ message: '该权限存在子权限，无法删除' })
    } else {
      let res = await AuthDao.delete({ id })

      if (res.affectedRows >= 1) {
        ctx.success({ message: '删除成功' })
      } else {
        return ctx.fail({ message: '删除失败' })
      }
    }
  }
}

module.exports = new AuthController()
