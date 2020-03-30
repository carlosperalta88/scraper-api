// role*court_name
import logger from '../config/winston'
import ScraperService from '../services/scraper'
import ScraperObserver from '../observers/Scraper'

const scraper = new ScraperObserver()

exports.addToScraperQueue = async (req, res) => {
  try {
    const cases = await ScraperService.rolesToScrape(req.body.query)
    return scraper
      .on('elementsAdded', (el) => {
        logger.info(`added ${el} cases`)
        return res.json({ rolesLength: el }).status(201)
      })
      .add(cases)
  } catch (e) {
    logger.error(`couldn't add roles to queue ${e}`)
    return res.status(500).send({ ...e })
  }
}

exports.executeScraper = async (req, res) => {
  try {
    scraper.scrape()
    return res.json({
      message: 'scrape started...'
    }).status(204)
  } catch (e) {
    logger.error(`couldn't start scraper ${e}`)
    return res.status(500).send({ error: e.name, message: e.message })
  }
}

exports.getQueueLength = async (req, res) => {
  try {
    const response = await ScraperService.getQueueLength(req.params.queue)
    res.json(response).status(200)
  } catch (error) {
    logger.error(`failed to get queue length`)
    return res.send({ error: error.name, message: error.message }).status(500)
  }
}

scraper
  .on('roleRemoved', ob => {
    logger.info(`${ob.role} successfully removed from queue`)
    return ob.sc.scrape()
  })
  .on('badResponse', response => {
    logger.error(response)
    return
  })
  .on('sentFailed', error => {
    logger.error(error)
    return
  })
  .on('failedStart', error => {
    logger.error(error)
    return
  })
  .on('sent', res => {
    logger.info(res)
    return
  })
