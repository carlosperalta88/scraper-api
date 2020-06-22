// role*court_name
import Cases from '../models/Cases'
import request from '../lib/api'

class ScraperService {
  constructor() {
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
        roles: cases.map(el => this.bodyBuild(el))
      }}
  }

  async addToScraperQueue(query) {
    const result = await Cases.search(query)
    console.log(result)
    return await request.do(this.addCasesPayloadBuilder(result))
  }

  async rolesToScrape(query) {
    const roles = await this.getRolesToScrape(query)
    return this.formatRolesToScrape(roles)
  }

  formatRolesToScrape(cases) {
    return cases.map(el => this.bodyBuild(el))
  }

  async getRolesToScrape(query) {
    return new Promise(async (resolve, reject) => {
      const roles = await Cases.bigSearch(query)
      const arr = []
      roles.on('data', (role) => arr.push(role))
      roles.on('end', () => {
        console.log('here')
        resolve(arr)
      })
    })
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

module.exports = new ScraperService()