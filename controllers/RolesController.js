const logger = require('../config/winston')
const roleService = require('../services/roles')

exports.get = async (req, res) => {
  try {
    const role = await roleService.get(req.params.external_id)
    res.json(role)
  } catch (error) {
    console.log(error)
    logger.info(error)
    res.send(error).status(500)
  }
}

exports.add = async (req, res) => {
  try {
    const role = await roleService.add(req.body)
    res.json(role).status(201)
  } catch (error) {
    console.log(error)
    logger.info(error)
    res.send(error).status(500)
  }
}