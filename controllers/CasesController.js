const logger = require('../config/winston')
const request = require('../lib/api')
import CaseService from '../services/cases'

exports.addCase = async (req, res) => {
  try {
    const newCase = await CaseService.caseCreator(req.body.role, req.body.court_id, req.body.external_id)
    await newCase.save()
    res.status(201).json(newCase)
  } catch (error) {
    logger.info(error)
    res.status(500).send(error)
  }
}

exports.addCases = async (req, res) => {
  Promise.all(req.body.cases.map(async item => CaseService.caseCreator(item.role, item.court_id, item.external_id)))
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
    console.log(error)
    logger.info(error)
    res.status(500).send(error)
  }
}

exports.deleteCaseByRole = async (req, res) => {
  try {
    const query = await CaseService.deleteOne(req.params.role)
    res.json(query)
  } catch (error) {
    logger.info(error)
    res.send(error)
  }
}

exports.compare = async(req, res, next) => {
  try {
    let [storedVersion] = await CaseService.requestCase(req.params.role)
    const casesComparisson = CaseService.compareCases(storedVersion, req.body)
    
    if(!casesComparisson.hasChanged) {
      logger.info(`no need to update ${req.params.role}`)
      res.send(`Nothing to update, entity ${req.params.role} has not changed`).status(200)
      return
    }

    res.locals.storedVersion = storedVersion
    res.locals.caseDiff = casesComparisson.diff
    next()
  } catch (error) {
    logger.error(`failed formatting the cause ${error}`)
    res.send(error).status(500)
  }
}

exports.update = async (req, res) => {
  try {
    let storedVersion = CaseService.buildPayload(res.locals.storedVersion, req)
    await storedVersion.save()
    logger.info(`${req.params.role} saved`)
    res.json(storedVersion).status(204)
    return 
  } catch (error) {
    logger.info(`failed saving the cause ${error}`)
    res.send(error).status(500)
    return 
  }
}

exports.buildReport = async (req, res) => {
  try {
    const data = await CaseService.getAllActiveRoles()
    const payload = {
      json: true,
      uri: `${process.env.REPORT_URL}/generate`,
      method: 'POST',
      body: { data }
    }

    const response = await request.do(payload)
    res.json(response)
  } catch (error) {
    logger.error(`failed formatting the cause ${error}`)
    res.send(error).status(500)
  }
}
