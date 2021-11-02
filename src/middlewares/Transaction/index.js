const sequelize = require("@/models/Dao/sequelize")

async function addTransaction(ctx, next) {
  ctx.transaction = sequelize.transaction.bind(sequelize)
  await next()
}

module.exports = addTransaction
