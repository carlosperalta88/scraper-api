/* eslint-disable require-jsdoc */
import {EventEmitter} from 'events'
import logger from '../../config/winston'
import request from '../../lib/api'
import sqs from '../SQS'

class ObservableScraper extends EventEmitter {
  constructor(queue = []) {
    super()
    this.delay = 5
    this.queue = queue
    this.scraping = true
    this.count = 0
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
        uri: // this should post the actual role to the scraper
        `${process.env.SCRAPER_URL}/add`,
        method: 'POST',
        body: {
          roles: [role],
        }}
      return request.do(payload)
          .then((response) => {
            if (response.code && response.code === 201) {
              this.emit('sent', {response, role})
              const idx = this.queue.indexOf(role)
              this.queue.splice(idx, 1)
              this.emit('roleRemoved', {sc: this.scrape, role: role})
              return this
            }
            this.emit('badResponse', response)
            return this
          })
          .catch((err) => {
            this.emit('sentFailed', {err, role})
            return this
          })
    }
    this.emit('failedStart',
        {scraping: this.scraping, queueLength: this.queue.length})
    return this
  }

  async sqsScrape(ctx) {
    const self = ctx || this
    if (self.scraping === true &&
      self.queue.length > 0 &&
      self.count < process.env.UPPER_LIMIT) {
      const role = self.queue[0]
      // await sqs.send(role)
      const idx = self.queue.indexOf(role)
      self.queue.splice(idx, 1)
      self.count+=1
      self.emit('roleRemoved', {sc: self.sqsScrape, role: role, context: self})
      return self
    }
    self.count = 0
    return self
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
    .on('roleRemoved', function(ob) {
      logger.info(`${ob.role} successfully removed from queue`)
      const ctx = ob.context
      return ob.sc(ctx)
    })
    .on('badResponse', (response) => {
      logger.error(response)
      return
    })
    .on('sentFailed', (error) => {
      logger.error(error)
      return
    })
    .on('failedStart', (error) => {
      logger.info(error)
      return
    })
    .on('sent', (res) => {
      logger.info(res)
      return
    })
    .on('elementsAdded', (el) => {
      logger.info(`added ${el} cases`)
      return
    })

export default scraper
