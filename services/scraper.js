// role*court_name
import Cases from '../models/Cases'
import request from '../lib/api'

class ScraperService {
  constructor(Cases) {
    this.cases = Cases
  }

  bodyBuild(item) {
    return encodeURI(`${item['role']}*${item['court']['name']}`)
  }
  
  addCasesPayloadBuilder(cases) {
    return {
      json: true,
      uri: `${process.env.SCRAPER_URL}/add`,
      method: 'POST',
      body: {
        roles: cases.map(el => bodyBuild(el))
      }}
  }

  async addToScraperQueue(query) {
    const result = await this.cases.search(query)
    return await request.do(this.addCasesPayloadBuilder(result))
  }

  async getQueueLength(queue) {
    const payload = {
      method: 'GET',
      json: true,
      uri: `${process.env.SCRAPER_URL}/count?name=${queue}`
    }
    return await request.do(payload)
  }
}

const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x)

module.exports = new ScraperService(Cases)