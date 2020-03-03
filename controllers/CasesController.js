const logger = require('../config/winston')
const request = require('../lib/api')
import CaseService from '../services/cases'

exports.addCase = async (req, res) => {
  try {
    const newCase = await CaseService.caseCreator(req.body)
    await newCase.save()
    res.status(201).json(newCase)
  } catch (error) {
    logger.info(error)
    res.status(500).send(error)
  }
}

exports.addCases = async (req, res) => {
  Promise.all(req.body.cases.map(async item => CaseService.caseCreator(item)))
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

exports.deleteCaseByRoleAndCourt = async (req, res) => {
  try {
    const query = await CaseService.deleteOne(req.params.role, req.body.court_id)
    res.json(query)
  } catch (error) {
    logger.info(error)
    res.send(error)
  }
}

exports.deleteManyCasesByExternalId = async (req, res) => {
  try {
    const query = await CaseService.deleteMany(req.body.external_ids)
    res.json(query)
  } catch (error) {
    logger.info(error)
    res.send(error)
  }
}

exports.update = async (req, res) => {
  try {
    const updatedCase = await CaseService.updateCase(req)
    logger.info(`${req.params.role} saved`)
    res.json(updatedCase).status(204)
    return 
  } catch (error) {
    logger.info(`failed saving the cause ${error}`)
    res.send(error).status(500)
    return 
  }
}

exports.buildReport = async (req, res) => {
  try {
    const data = await CaseService.aggregateByClient(req.params.client)
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