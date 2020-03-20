// role*court_name
import logger from '../config/winston'
import request from '../lib/api'
import ScraperService from '../services/scraper'
import ScraperObserver from '../observers/Scraper'

const scraper = new ScraperObserver()

exports.addToScraperQueue = async (req, res) => {
  try {
    const cases = await ScraperService.rolesToScrape(req.body.query)
    scraper
      .on('elementsAdded', (el) => {
        logger.info(`added ${el} cases`)
        res.json({ rolesLength: el }).status(201)
      })
      .add(cases)
  } catch (e) {
    logger.error(`couldn't add roles to queue ${e}`)
    res.status(500).send({ ...e })
  }
}

exports.executeScraper = async (req, res) => {
  try {
    scraper.scrape()
    res.status(200)
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

scraper
  .on('roleRemoved', role => logger.info(`${role} successfully removed from queue`))
  .on('badResponse', response => logger.error(response))
  .on('sentFailed', error => logger.error(error))
  .on('failedStart', error => logger.error(error))
