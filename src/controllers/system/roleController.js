const RoleDao = require('@/models/Dao/RoleDao')

const PageUtil = require('@/utils/PageUtil')

class RoleController {
  constructor() {}

  async list(ctx) {
    const { roleName = '', pageNum = 1, pageSize = 10 } = ctx.request.body
    let res = await RoleDao.list({ roleName, pageNum, pageSize })
    let pageRes = PageUtil(res, pageNum, pageSize)
    pageRes.list = pageRes.list.map((item) => {
      return {
        id: item.id,
        roleName: item.role_name,
        updateTime: item.update_time,
        createTime: item.create_time,
      }
    })
    ctx.success({ message: '成功', data: pageRes })
  }

  async add(ctx) {
    const { roleName, des, authIdList } = ctx.request.body
    if (!roleName) {
      return ctx.fail({ message: '请传入角色名称' })
    }
    let res = await RoleDao.add({ roleName, des })
    let bindRes = await RoleDao.bindAuth({ id: res.insertId, authIdList })
    if (res.affectedRows === 1) {
      ctx.success({ message: '添加成功' })
    } else {
      ctx.fail({ message: '添加失败' })
    }
  }

  async detail(ctx) {
    const { id } = ctx.request.body
    if (!id) {
      return ctx.fail({ message: '请传入角色id' })
    }
    const res = await RoleDao.findRole({ id })
    const role = res[0]

    const authRes = await RoleDao.findAuthList({ id })

    ctx.success({
      data: {
        id: role.id,
        roleName: role.role_name,
        des: role.des,
        authIdList: authRes.map((item) => item.auth_id),
      },
    })
  }

  async update(ctx) {
    const { roleName, id, des, authIdList } = ctx.request.body
    if (!id) {
      return ctx.fail({ message: '请传入角色id' })
    } else if (!roleName) {
      return ctx.fail({ message: '请传入角色名称' })
    }

    let bindRes = await RoleDao.bindAuth({ id, authIdList })

    let res = await RoleDao.update({ roleName, id, des })
    if (res.affectedRows === 1) {
      ctx.success({ message: '修改成功' })
    } else {
      ctx.fail({ message: '修改失败' })
    }
  }

  async delete(ctx) {
    const { id } = ctx.request.body
    if (!id) {
      return ctx.fail({ message: '请传入角色id' })
    }

    if (+id === 1) {
      return ctx.fail({ message: '管理员角色不能删除' })
    }

    let res = await RoleDao.delete({ id })
    if (res.affectedRows === 1) {
      ctx.success({ message: '删除成功' })
    } else {
      ctx.fail({ message: '删除失败' })
    }
  }

  async bindAuth(ctx) {
    let { id, authIdList } = JSON.parse(ctx.request.body)
    if (!id) {
      return ctx.fail({ message: '请传入角色id' })
    } else if (authIdList && !Array.isArray(authIdList)) {
      return ctx.fail({ message: '请传入权限id数组' })
    }
    let res = await RoleDao.bindAuth({ id, authIdList })

    if (res) {
      ctx.success({ message: '绑定成功' })
    } else {
      ctx.fail({ message: '绑定失败' })
    }
  }
}

module.exports = new RoleController()
