import Roles from '../models/Roles'

class RolesService {
  constructor(Roles) {
    this.roles = Roles
  }

  async get(name) {
    return await this.roles.search({ name })
  }

  async add(body) {
    return await this.roles.add(body)
  }

}

module.exports = new RolesService(Roles)