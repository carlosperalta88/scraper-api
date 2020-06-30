import Roles from '../models/Roles'

class RolesService {
  constructor(Roles) {
    this.roles = Roles
  }

  async get(name) {
    return await this.roles.search({ name })
  }

  async add(query) {
    return await this.roles.create(query)
  }

}

module.exports = new RolesService(Roles)