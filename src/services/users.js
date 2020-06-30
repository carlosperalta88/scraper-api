/* eslint-disable require-jsdoc */
import Users from '../models/Users'
import Clients from '../models/Clients'
import Roles from '../models/Roles'

class UsersService {
  constructor() {
  }

  async get(email) {
    return await Users.search({email})
  }

  async add(body) {
    const [role] = await Roles.search(body['role'])
    const [client] = await Clients.search(body['client'])
    body['role'] = role
    body['client'] = client
    return await Users.create(body)
  }

  async getIdBySearch(query) {
    return await Users.getId(query)
  }

  async getEmailById(query) {
    return await Users.getEmailById(query)
  }

  async search(query) {
    return await Users.search(query)
  }

  async delete(email) {
    return await Users.delete(email)
  }
  async update(email, body) {
    return await Users.update(email, body)
  }
}

module.exports = new UsersService()
