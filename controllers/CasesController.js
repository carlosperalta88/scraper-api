const logger = require('../config/winston')
import CaseService from '../service/cases'

exports.addCase = async (req, res) => {
  try {
    const newCase = await CaseService.caseCreator(req.body.role, req.body.court_id)
    await newCase.save()
    res.status(201).json(newCase)
  } catch (error) {
    logger.info(error)
    res.status(500).send(error)
  }
}

exports.addCases = async (req, res) => {
  Promise.all(req.body.cases.map(async item => CaseService.caseCreator(item.role, item.court_id)))
    .then(async (items) => {  
      await CaseService.insertMany(items)
      res.status(201).json(items)
    }).catch((e) => res.status(500).send({ error: e.name, message: e.message }))
}

exports.getCaseByRole = async (req, res) => {
  try {
    const reqCase = await CaseService.requestCase(req.params.role)
    res.json(reqCase)
  } catch (error) {
    logger.info(error)
    res.status(500).send(error)
  }
}

exports.deleteCaseByRole = async (req, res) => {
  try {
    const query = await CaseService.updateOne(req.params.role)
    res.json(query)
  } catch (error) {
    logger.info(error)
    res.send(error)
  }
}

exports.update = async (req, res) => {
  try {
    let [storedVersion] = await CaseService.requestCase(req.params.role)
    const isUpdated = CaseService.compareCases(storedVersion, req.body)
    
    if(!isUpdated) {
      logger.info(`no need to update ${req.params.role}`)
      res.send(`Nothing to update, entity ${req.params.role} has not changed`).status(200)
      return
    }

    storedVersion = CaseService.buildPayload(storedVersion, req)

    try {
      await storedVersion.save()
      logger.info(`${req.params.role} saved`)
      res.json(storedVersion).status(204)
      return 
    } catch (error) {
      logger.info(`failed saving the cause ${error}`)
      res.send(error).status(500)
      return 
    }
  } catch (error) {
    logger.error(`failed formatting the cause ${error}`)
    res.send(error).status(500)
  }
}