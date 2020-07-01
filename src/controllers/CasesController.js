import logger from '../config/winston'
import CaseService from '../services/cases'

exports.addCases = async (req, res) => {
  try {
    const cases = await CaseService.add(req.body.cases)
    res.json(cases).status(202)
  } catch (error) {
    logger.info(error)
    return res.send(error).status(500)
  }
}

exports.searchCases = async (req, res) => {
  try {
    const search = await CaseService.search(req.body.query)
    res.json(search).status(200)
  } catch (error) {
    logger.info(error)
    return res.send(error).status(500)
  }
}

exports.deleteCaseByRoleAndCourt = async (req, res) => {
  try {
    const query = await CaseService
        .deleteOne(req.params.role, req.body.court_id)
    res.json(query)
  } catch (error) {
    logger.info(error)
    return res.send(error)
  }
}

exports.deleteManyCasesByExternalId = async (req, res) => {
  try {
    const query = await CaseService
        .deleteManyByExternalId(req.body.external_ids)
    res.json(query)
  } catch (error) {
    logger.info(`fail ${error}`)
    return res.send(error).status(500)
  }
}