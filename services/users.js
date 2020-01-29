const Users = require('../models/Users')
const Roles = require('../services/roles')
const Clients = require('../services/clients')
const logger = require('../config/winston')

class UsersService {
  constructor() {
    this.logger = logger
    this.users = Users
    this.roles = Roles
    this.clients = Clients
  }

  async get(email) {
    return await this.users.find({ email })
  }

  async add(body) {
    console.log(body)
    let role
    let client
    try {
      role = await this.roles.get(body['role'])
      client = await this.clients.get(body['client'])
    } catch (error) {
      this.logger.info(error)
      throw new Error(error)
    }
    let newUser = JSON.parse(JSON.stringify(body))
    newUser['role'] = role[0]
    newUser['client'] = client[0]
    const user = new this.users(newUser)
    await user.save()
    return user
  }

  async search(body) {
    return await this.users.find(body)
  }

  async delete(email) {
    return await this.users.updateOne({ email: email }, { $set: { is_active: false } })
  }

  async update(email, body) {
    return await this.users.updateOne({ email }, { $set: body })
  }

}

module.exports = new UsersService()