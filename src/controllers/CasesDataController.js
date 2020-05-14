import logger from '../config/winston'
import CasesDataService from '../services/casesData'
import ObservableInsert from '../observers/Insert'
import NotificationObserver from '../observers/Notifications'
import SQSObservable from '../observers/SQS'
import ScraperObserver from '../observers/Scraper'

exports.add = async (req, res) => {
  try {
    const [updatedCase] = await CasesDataService.add(req)
    logger.info(`${req.params.role} saved`)
    ObservableInsert.checkInsert(updatedCase)
    res.json({ case: req.params.role }).status(204)
    return 
  } catch (error) {
    logger.info(`failed saving the cause ${error}`)
    res.send(error).status(500)
    return 
  }
}

ObservableInsert
  .on('compare', async (role) => {
    logger.info(`comparing role ${role['case_id']}`)
    const [latest] = await CasesDataService.getLatest(role['case_id'])

    if (!latest) {
      logger.info(`nothing to compare with ${role['case_id']}`)
      return
    }

    const comparison = CasesDataService.compare(role, latest)

    if (comparison.variation.length === 0) {
      logger.info(`no changes have been detected for ${role['case_id']}`)
      return
    }

    await NotificationObserver.add(comparison)
    return 
  })

SQSObservable
  .on('addFromSQS', async (payload) => {
    if (payload.error) {
      console.log(payload)
      if (payload.case === 'undefined') return
      logger.info(`retry ${payload.case}`)
      ScraperObserver
        .add(payload.case)
        .sqsScrape()
        return
    }
    if (payload.case) return
    logger.info(`adding CaseData ${payload.role_search[0].role}`)
    try {
      const [updatedCase] = await CasesDataService.add({ body: payload, params: { role: payload.role_search[0].role } })
      ObservableInsert.checkInsert(updatedCase)
      logger.info(`saved ${payload.role_search[0].role}`)
      return
    } catch (error) {
      logger.error(`sqs failed adding: ${error} ${JSON.stringify(payload['role_search'])}`)
      return
    }
  })

NotificationObserver
  .on('created', (notification) => {
    logger.info(`notification id ${notification['_id']} created`)
    return
  })
  .on('error', e => {
    logger.error(`failed notification creation ${e}`)
    return
  })