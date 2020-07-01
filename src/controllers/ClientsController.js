import logger from '../config/winston'
import clientService from '../services/clients'

exports.get = async (req, res) => {
  try {
    const client = await clientService.get(req.params.external_id)
    res.json(client)
  } catch (error) {
    console.log(error)
    logger.info(error)
    res.send(error).status(500)
  }
}

exports.add = async (req, res) => {
  try {
    const client = await clientService.add(req.body)
    res.json(client).status(201)
  } catch (error) {
    console.log(error)
    logger.info(error)
    res.send(error).status(500)
  }
}

exports.search = async (req, res) => {
  try {
    const query = await clientService.search(req.body.query)
    res.json(query).status(200)
  } catch (error) {
    console.log(error)
    logger.info(error)
    res.send(error).status(500)
  }
}

exports.delete = async (req, res) => {
  try {
    const deactivateClient = await clientService.delete(req.params.external_id)
    res.json(deactivateClient).status(204)
  } catch (error) {
    console.log(error)
    logger.info(error)
    res.send(error).status(500)
  }
}

exports.update = async (req, res) => {
  try {
    const client = await clientService.update(req.params.external_id, req.body)
    res.json(client).status(204)
  } catch (error) {
    console.log(error)
    logger.info(error)
    res.send(error).status(500)
  }
}
