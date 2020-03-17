// role*court_name
import logger from '../config/winston'
import request from '../lib/api'
import ScraperService from '../services/scraper'

exports.addToScraperQueue = async (req, res) => {
  try {
    const cases = await ScraperService.addToScraperQueue(req.body.query)
    res.json(cases).status(cases.code)
  } catch (e) {
    logger.error(`couldn't add roles to queue ${e}`)
    res.status(500).send({ ...e })
  }
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
    const response = await ScraperService.getQueueLength(req.params.queue)
    res.json(response).status(200)
  } catch (error) {
    logger.error(`failed to get queue length`)
    res.send({ error: error.name, message: error.message }).status(500)
  }
}