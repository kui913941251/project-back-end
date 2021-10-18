const RoleDao = require('@/models/Dao/RoleDao')

const PageUril = require('@/utils/PageUtil')

class RoleController {
  constructor() {}

  async list(ctx) {
    const { roleName = '', pageNum = 1, pageSize = 10 } = ctx.request.body
    let res = await RoleDao.list({ roleName, pageNum, pageSize })
    ctx.success({ message: '成功', data: PageUril(res, pageNum, pageSize) })
  }

  async add(ctx) {
    const { roleName } = ctx.request.body
    if (!roleName) {
      return ctx.fail({ message: '请传入角色名称' })
    }
    let res = await RoleDao.add({ roleName })
    if (res.affectedRows === 1) {
      ctx.success({ message: '添加成功' })
    } else {
      ctx.fail({ message: '添加失败' })
    }
  }

  async update(ctx) {
    const { roleName, roleId } = ctx.request.body
    if (!roleId) {
      return ctx.fail({ message: '请传入角色id' })
    } else if (!roleName) {
      return ctx.fail({ message: '请传入角色名称' })
    }

    let res = await RoleDao.update({ roleName, roleId })
    if (res.affectedRows === 1) {
      ctx.success({ message: '修改成功' })
    } else {
      ctx.fail({ message: '修改失败' })
    }
  }

  async delete(ctx) {
    const { roleId } = ctx.request.body
    if (!roleId) {
      return ctx.fail({ message: '请传入角色id' })
    }

    if (+roleId === 1) {
      return ctx.fail({ message: '管理员角色不能删除' })
    }

    let res = await RoleDao.delete({ roleId })
    if (res.affectedRows === 1) {
      ctx.success({ message: '删除成功' })
    } else {
      ctx.fail({ message: '删除失败' })
    }
  }

  async bindAuth(ctx) {
    let { roleId, authIdList } = JSON.parse(ctx.request.body)
    if (!roleId) {
      return ctx.fail({ message: '请传入角色id' })
    } else if (authIdList && !Array.isArray(authIdList)) {
      return ctx.fail({ message: '请传入权限id数组' })
    }
    let res = await RoleDao.bindAuth({ roleId, authIdList })

    if (res) {
      ctx.success({ message: '绑定成功' })
    } else {
      ctx.fail({ message: '绑定失败' })
    }
  }
}

module.exports = new RoleController()
