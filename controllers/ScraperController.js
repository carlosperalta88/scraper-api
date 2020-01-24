// role*court_name
const Case = require('../models/Cases')
const request = require('../lib/api')
const logger = require('../config/winston')

exports.addRoleToScraperQueue = async (req, res) => {
  try {
    const caseToAdd = await findByRoleAndCourt(req.params.role, req.params.court)
    const response = await request.do(addCasesPayloadBuilder(caseToAdd))
    res.json(response)
  } catch (e) {
    logger.error(`couldn't add role to queue ${e}`)
    res.status(500).send({ ...e })
  }
}

const findByRoleAndCourt = async (role, court) => {
  const r = await Case.find({ role, "court.external_id": court })
  return r
}

const bodyBuild = (item) => {
  return encodeURI(`${item['role']}*${item['court']['name']}`)
}

const addCasesPayloadBuilder = (cases) => {
  return {
    json: true,
    uri: `${process.env.SCRAPER_URL}/add`,
    method: 'POST',
    body: {
      roles: cases.map(el => bodyBuild(el))
    }}
}

exports.addManyRolesToScraperQueue = async (req, res) => {
  try {
    const casesToAdd = await findAllActiveRoles()
    const response = await request.do(addCasesPayloadBuilder(casesToAdd))
    res.status(response.code).json(response)
  } catch (e) {
    logger.error(`couldn't add roles to queue ${e}`)
    res.status(500).json({error: e.toString()})
  }
}

const findAllActiveRoles = async () => {
  const cases = await Case.find({ is_active: true })
  return cases
}

exports.executeScraper = async (req, res) => {
  try {
    if (!req.query.queue) {
      throw new Error('Missing queue name')
    }
    (function loop (index) {const payload = {
      method: 'GET',
      json: true,
      uri: `${process.env.SCRAPER_URL}/execute?queue=${req.query.queue}`
    }
    setTimeout(() => {
      let response = request.do(payload)
      if (--index) loop(index)
    }, 10000)})(req.query.length)
    res.send('starting')
  } catch (e) {
    logger.error(`couldn't start scraper ${e}`)
    res.status(500).send({ error: e.name, message: e.message })
  }
}

exports.getQueueLength = async (req, res) => {
  try {
    const payload = {
      method: 'GET',
      json: true,
      uri: `${process.env.SCRAPER_URL}/count?name=${req.params.queue}`
    }
    const response = await request.do(payload)
    res.json(response).status(200)
  } catch (error) {
    logger.error(`failed to get queue length`)
    res.send({ error: error.name, message: error.message }).status(500)
  }
}