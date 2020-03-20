import { EventEmitter } from 'events'
import request from '../lib/api'

class ObservableScraper extends EventEmitter{
  constructor(queue = []) {
    super()
    this.delay = 5
    this.queue = queue
    this.scraping = true
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
      request.do(payload)
        .then(response => {
          if (response.code && response.code === 201) {
            this.emit('sent', { response, role })
            const idx = this.queue.indexOf(role)
            this.queue.splice(idx, 1)
            this.emit('roleRemoved', role)
            return this
          }
          this.emit('badResponse', response)
          return this
        })
        .catch(err => {
          this.emit('sentFailed', { err, role })
          return this
        })
        return this
      }
    this.emit('failedStart', { scraping: this.scraping, queueLength: this.queue.length })
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
  }
}