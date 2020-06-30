/* eslint-disable require-jsdoc */
import Clients from '../models/Clients'

class ClientsService {
  constructor(Clients) {
    this.clients = Clients
  }

  async get(externalId) {
    return await this.clients.search({external_id: externalId})
  }

  async add(body) {
    return await this.clients.create(body)
  }

  async search(query) {
    return await this.clients.search(query)
  }

  async delete(externalId) {
    return await this.clients.delete(externalId)
  }
  async update(externalId, body) {
    return await this.clients.update(externalId, body)
  }
}

module.exports = new ClientsService(Clients)
