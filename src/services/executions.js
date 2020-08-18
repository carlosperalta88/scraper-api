/* eslint-disable require-jsdoc */
import Executions from '../models/Executions'
import ScraperService from '../services/scraper'
import ScraperObserver from '../observers/Scraper'
import CasesService from '../services/cases'
import composePromises from '../lib/composePromises'
import ExecutionObserver from '../observers/Executions'

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
    if (!array) return []
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

  async getRolesExternalIds(executionId) {
    return await Executions.getRolesExternalIds({_id: executionId})
  }

  pullListOfIds(roles) {
    return roles[0]['role_external_ids']
  }

  async getLatestCasesData(externalIds) {
    return await CasesService.getLatestData({external_id: {$in: externalIds}})
  }

  async getChanges(executionId) {
    return await composePromises(
        this.getRolesExternalIds,
        this.pullListOfIds,
        this.getLatestCasesData)(executionId)
  }
}

export default new ExecutionsService()
