import Executions from '../models/Executions'
import ScraperService from '../services/scraper'
import ScraperObserver from '../observers/Scraper'

class ExecutionsService {
  constructor() {}

  async create () {
    return await Executions.create()
  }

  async get (id) {
    return await Executions.get(id)
  }

  async patch (id, data) {
    return await Executions.update(id, data)
  }

  async start (id) {
    const execution = await Executions.get(id)
    const cases = await ScraperService.rolesToScrape({ "$and": [ { "external_id": { "$in": execution['role_external_ids'] } } ] })
    ScraperObserver.add(cases)
    return execution
  }
}

module.exports = new ExecutionsService()