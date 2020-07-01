// role*court_name
import logger from '../config/winston'
import ScraperService from '../services/scraper'
import ScraperObserver from '../observers/Scraper'

exports.addToScraperQueue = async (req, res) => {
  try {
    const cases = await ScraperService.rolesToScrape(req.body.query)
    ScraperObserver.add(cases)
    res.json(cases).status(201)
  } catch (e) {
    logger.error(`couldn't add roles to queue ${e}`)
    return res.status(500).send({...e})
  }
}

exports.executeScraper = async (req, res) => {
  try {
    ScraperObserver.scrape()
    return res.json({
      message: 'scrape started...',
    }).status(204)
  } catch (e) {
    logger.error(`couldn't start scraper ${e}`)
    return res.status(500).send({error: e.name, message: e.message})
  }
}

exports.getQueueLength = async (req, res) => {
  try {
    const response = await ScraperService.getQueueLength(req.params.queue)
    res.json(response).status(200)
  } catch (error) {
    logger.error(`failed to get queue length`)
    return res.send({error: error.name, message: error.message}).status(500)
  }
}

exports.executeScraperSQS = async (req, res) => {
  try {
    ScraperObserver.sqsScrape()
    return res.json({
      message: 'scrape started in SQS...',
    }).status(204)
  } catch (error) {
    logger.error(`failed SQS: ${error}`)
    return res.status(500).send({error: e.name, message: e.message})
  }
}

exports.pullFromSQS = async (req, res) => {
  try {
    ScraperObserver.pullSQSRoles()
    return res.json({
      message: 'Pulling scraped cases SQS...',
    }).status(204)
  } catch (error) {
    logger.error(`failed SQS: ${error}`)
    return res.status(500).send({error: e.name, message: e.message})
  }
}
