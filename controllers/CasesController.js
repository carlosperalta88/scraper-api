import logger from '../config/winston'
import request from '../lib/api'
import CaseService from '../services/cases'

exports.addCases = async (req, res) => {
  try {
    const cases = await CaseService.addManyCases(req.body.cases)
    res.json(cases).status(202)
  } catch (error) {
    logger.info(error)
    res.send(error).status(500)
  }
}

exports.searchCases = async (req, res) => {
  try {
    const search = await CaseService.search(req.body.search)
    res.json(search).status(200)
  } catch (error) {
    logger.info(error)
    res.send(error).status(500)
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
    logger.info(`fail ${error}`)
    res.send(error).status(500)
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