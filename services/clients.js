import Clients from '../models/Clients'

class ClientsService {
  constructor(Clients) {
    this.clients = Clients
  }

  async get(external_id) {
    return await this.clients.get(external_id)
  }

  async add(body) {
    return await this.clients.add(body)
  }

  async search(query) {
    return await this.clients.search(query)
  }

  async delete(external_id) {
    return await this.clients.delete(external_id)
  }
  async update(external_id, body) {
    return await this.clients.update(external_id, body)
  }
}

module.exports = new ClientsService(Clients)