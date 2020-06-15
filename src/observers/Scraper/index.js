import { EventEmitter } from 'events'
import logger from '../../config/winston'
import request from '../../lib/api'
import sqs from '../SQS'

class ObservableScraper extends EventEmitter{
  constructor(queue = []) {
    super()
    this.delay = 5
    this.queue = queue
    this.scraping = true
    this.currentSlice = []
  }

  add(elements) {
    this.queue = this.queue.concat(elements)
    this.emit('elementsAdded', this.queue.length)
    return this
  }

  scrape() {
    if (this.scraping && this.queue.length > 0) {
      const role = this.queue[0]
      const payload = {
        json: true,
        uri: `${process.env.SCRAPER_URL}/add`, //this should post the actual role to the scraper
        method: 'POST',
        body: {
          roles: [role]
        }}
      return request.do(payload)
        .then(response => {
          if (response.code && response.code === 201) {
            this.emit('sent', { response, role })
            const idx = this.queue.indexOf(role)
            this.queue.splice(idx, 1)
            this.emit('roleRemoved', {sc: this.scrape, role: role})
            return this
          }
          this.emit('badResponse', response)
          return this
        })
        .catch(err => {
          this.emit('sentFailed', { err, role })
          return this
        })
      }
    this.emit('failedStart', { scraping: this.scraping, queueLength: this.queue.length })
    return this
  }

  async sqsScrape() {
    this.currentSlice = this.currentSlice.concat(this.queue.slice('', process.env.UPPER_LIMIT))
    if (this.scraping && this.currentSlice.length > 0) { 
      const role = this.currentSlice[0]
      await sqs.send(role)
      const idx = this.currentSlice.indexOf(role)
      this.queue.splice(idx, 1)
      this.currentSlice.splice(idx, 1)
      this.emit('roleRemoved', {sc: this.sqsScrape, role: role})
      return this
    }
    return this
  }

  removeFromQueue(caseString) {
    const idx = this.queue.indexOf(caseString)
    this.queue.splice(idx, 1)
    return this
  }

  pauseScraper() {
    this.scrape = false
    this.emit('pause', `Queue stopped at ${this.queue.length}`)
    return this
  }

  startScraper() {
    this.scrape = true
    this.emit('resume', `Quere resumed with ${this.queue.length} items`)
    return this
  }

  async pullSQSRoles() {
    await sqs.receive()
    this.emit('pull')
    return this
  }
}

const scraper = new ObservableScraper()

scraper
  .on('roleRemoved', ob => {
    logger.info(`${ob.role} successfully removed from queue`)
    return ob.sc()
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

export default scraper