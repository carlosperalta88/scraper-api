const Clients = require('../models/Clients')
const logger = require('../config/winston')

class ClientsService {
  constructor() {
    this.logger = logger
    this.clients = Clients
  }

  async get(external_id) {
    return await this.clients.find({ external_id })
  }

  async add(body) {
    const client = new this.clients(body)
    await client.save()
    return client
  }

  async search(body) {
    return await this.clients.find(body)
  }

  async delete(external_id) {
    return await this.clients.updateOne({ external_id: external_id }, { $set: { is_active: false } })
  }

  async update(external_id, body) {
    return await this.clients.updateOne({ external_id }, { $set: body })
  }

}

module.exports = new ClientsService()