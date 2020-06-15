import { EventEmitter } from 'events'
import logger from '../../config/winston'
import NotificationObserver from '../Notifications'
import CasesDataService from '../../services/casesData'
import ScraperService from '../../services/scraper'
import ScraperObserver from '../Scraper'

class ObservableInsert extends EventEmitter {
  constructor() {
    super()
  }
  
  checkInsert(payload) {
    if (!payload) return this

    if (payload['document_status'] === 'Failed' || payload['document_status'] === '') {
      this.emit('retry', payload)
      return this
    }
    this.emit('compare', payload)
    return this
  }
}

const insert = new ObservableInsert()

insert
  .on('compare', async (role) => {
    logger.info(`comparing role ${role['case_id']}`)
    const [latest] = await CasesDataService.getLatest(role['case_id'])

    if (!latest) {
      logger.info(`nothing to compare with ${role['case_id']}`)
      return
    }

    const comparison = CasesDataService.compare(role, latest)

    if (comparison.variation.length === 0) {
      logger.info(`no changes for ${role['case_id']}`)
      return
    }

    logger.info(`changes for ${role['case_id']}`)
    await NotificationObserver.add(comparison)
    return 
  })
  .on('retry', async (role) => {
    logger.info(`retrying role ${role['case_id']}`)
    // const cases = await ScraperService.rolesToScrape({ _id: role['case_id']})
    // ScraperObserver
    //   .add(cases)
    //   .scrape()
    
    // ScraperObserver
    //   .add(cases)
    //   .sqsScrape()
    return
})

module.exports = insert