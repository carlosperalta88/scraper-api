/* eslint-disable require-jsdoc */
import Executions from '../models/Executions'
import ScraperService from '../services/scraper'
import ScraperObserver from '../observers/Scraper'

class ExecutionsService {
  constructor() {}

  async create() {
    return await Executions.create()
  }

  async get(id) {
    return await Executions.search({_id: id})
  }

  async patch(id, data) {
    return await Executions.update(id, data)
  }

  slicer(array, size) {
    if (!arra) return []
    const ch = array.slice(0, size)
    if (!ch.length) return array
    return [ch].concat(this.slicer(array.slice(size, array.length), size))
  }

  async start(id, pagination) {
    const [execution] = await Executions.search({_id: id})
    const rolesArrays =
    this.slicer(execution['role_external_ids'], pagination.limit)
    const cases = await ScraperService.rolesToScrape(
        {'$and': [{'external_id': {'$in': rolesArrays[pagination.page]}}]})
    ScraperObserver.add(cases)
    return execution
  }
}

module.exports = new ExecutionsService()
