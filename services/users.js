import Users from '../models/Users'
import Clients from '../models/Clients'
import Roles from '../models/Roles'

class UsersService {
  constructor(Users) {
  this.users = Users
  }

  async get(email) {
    return await this.users.get(email)
  }

  async add(body) {
    const [role] = await Roles.search(body['role'])
    const [client] = await Clients.search(body['client'])
    body['role'] = role
    body['client'] = client
    return await this.users.add(body)
  }

  async getIdBySearch(query) {
    return await this.users.getId(query)
  }

  async search(query) {
    return await this.users.search(query)
  }

  async delete(email) {
    return await this.users.delete(email)
  }
  async update(email, body) {
    return await this.users.update(email, body)
  }
}

module.exports = new UsersService(Users)