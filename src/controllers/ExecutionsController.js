import logger from '../config/winston'
import executionService from '../services/executions'
import ExecutionObserver from '../observers/Executions'

exports.create = async (req, res) => {
  try {
    const executionData = await executionService.create()
    ExecutionObserver.add(executionData, req.body.ids)
    res.json(executionData).status(201)
  } catch (error) {
    logger.info(`Error: adding execution ${error}`)
    res.send(error).status(500)
    return
  }
}

exports.get = async (req, res) => {
  try {
    const executionData = await executionService.get(req.params.id)
    res.json(executionData).status(200)
  } catch (error) {
    logger.info(`Error: getting execution ${error}`)
    res.send(error).status(500)
    return
  }
}

exports.edit = async (req, res) => {
  try {
    const executionData =
    await executionService.patch(req.params.id, req.body.ids)
    res.json(executionData).status(200)
  } catch (error) {
    logger.info(`Error: adding roles to execution ${error}`)
    res.send(error).status(500)
    return
  }
}

exports.start = async (req, res) => {
  try {
    const pagination = {limit: req.query.limit || 20,
      page: req.query.page || 1}

    const execution = await executionService.start(req.params.id, pagination)
    res.json(execution).status(200)
  } catch (error) {
    logger.info(`Error: starting execution ${error}`)
    res.send(error).status(500)
    return
  }
}

