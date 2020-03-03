const Users = require('../models/Users')
const logger = require('../config/winston')

class UsersService {
  constructor(Users, logger) {
    this.logger = logger
    this.users = Users
  }

}

module.exports = new UsersService(Users, logger)