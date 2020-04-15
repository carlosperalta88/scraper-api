// role*court_name
import logger from '../config/winston'
import ScraperService from '../services/scraper'
import ScraperObserver from '../observers/Scraper'
import ObservableInsert from '../observers/Insert'

exports.addToScraperQueue = async (req, res) => {
  try {
    const cases = await ScraperService.rolesToScrape(req.body.query)
    ScraperObserver.add(cases)
    res.json(cases).status(201)
  } catch (e) {
    logger.error(`couldn't add roles to queue ${e}`)
    return res.status(500).send({ ...e })
  }
}

exports.executeScraper = async (req, res) => {
  try {
    ScraperObserver.scrape()
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

ScraperObserver
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
    logger.info(error)
    return
  })
  .on('sent', res => {
    logger.info(res)
    return
  })
  .on('elementsAdded', (el) => {
    logger.info(`added ${el} cases`)
    return 
  })

ObservableInsert
  .on('retry', async (role) => {
    logger.info(`retrying role ${role}`)
    const cases = await ScraperService.rolesToScrape({ _id: role['case_id']})
    ScraperObserver
      .add(cases)
      .scrape()
    return
})
