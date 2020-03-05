import Clients from '../models/Clients'

class ClientsService {
  constructor(Clients) {
    this.clients = Clients
  }

  async get(email) {
    return await this.clients.get(email)
  }

  async add(body) {
    return await this.clients.add(body)
  }

  async search(query) {
    return await this.clients.search(query)
  }

  async delete(email) {
    return await this.clients.delete(email)
  }
  async update(email, body) {
    return await this.clients.update(email, body)
  }
}

module.exports = new ClientsService(Clients)