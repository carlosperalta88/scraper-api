const Clients = require('../models/Clients')
const logger = require('../config/winston')

class ClientsService {
  constructor(Clients, logger) {
    this.logger = logger
    this.clients = Clients
  }

}

module.exports = new ClientsService(Clients, logger)