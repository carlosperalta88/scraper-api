const Roles = require('../models/Roles')
const logger = require('../config/winston')

class RolesService {
  constructor() {
    this.logger = logger
    this.roles = Roles
  }

  async get(name) {
    return await this.roles.find({ name })
  }

  async add(body) {
    const role = new this.roles(body)
    await role.save()
    return role
  }

}

module.exports = new RolesService()