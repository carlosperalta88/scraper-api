import Users from '../models/Users'

class UsersService {
  constructor(Users) {
  this.users = Users
  }

  async get(email) {
    return await this.users.get(email)
  }

  async add(body) {
    return await this.users.add(body)
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