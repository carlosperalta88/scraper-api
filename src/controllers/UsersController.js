import logger from '../config/winston'
import userService from '../services/users'

exports.get = async (req, res) => {
  try {
    const user = await userService.get(req.params.email)
    res.json(user)
  } catch (error) {
    console.log(error)
    logger.info(error)
    res.send(error).status(500)
  }
}

exports.add = async (req, res) => {
  try {
    const user = await userService.add(req.body)
    res.json(user).status(201)
  } catch (error) {
    console.log(error)
    logger.info(error)
    res.send(error).status(500)
  }
}

exports.search = async (req, res) => {
  try {
    const query = await userService.search(req.body.query)
    res.json(query).status(200)
  } catch (error) {
    console.log(error)
    logger.info(error)
    res.send(error).status(500)
  }
}

exports.delete = async (req, res) => {
  try {
    const deactivateUser = await userService.delete(req.params.email)
    res.json(deactivateUser).status(204)
  } catch (error) {
    console.log(error)
    logger.info(error)
    res.send(error).status(500)
  }
}

exports.update = async (req, res) => {
  try {
    const user = await userService.update(req.params.email, req.body)
    res.json(user).status(204)
  } catch (error) {
    console.log(error)
    logger.info(error)
    res.send(error).status(500)
  }
}
