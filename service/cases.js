const Cases = require('../models/Cases')
const Courts = require('../models/Courts')
const logger = require('../config/winston')

class CaseService {
  constructor() {
    this.cases = Cases
    this.courts = Courts
    this.logger = logger
  }

  async requestCase(role) {
    return await this.cases.find({ role: role })
  }

  async deleteOne(role) {
    return await this.cases.updateOne({ role: role }, { is_active: false })
  }

  async insertMany(items) {
    return await this.cases.insertMany(items)
  }

  async getAllActiveRoles() {
    return await this.cases.find({ is_active: true })
  }
  
  formatScraperResponse(scraperResponse) {
    try {
      const modelKeys = ['court','cover','role','document_status','receptor','pending_docs','cause_history','exhorts']
      const newObject = new Object()
      const objectBuilder = modelKeys.map((el, elIndex) => {
        if(elIndex < 3) {
          newObject[el] = scraperResponse['role_search'][0][el].trim()
          return
        }
  
        if(elIndex === 3) {
          newObject[el] = scraperResponse['status']
          return
        }
  
        newObject[el] = scraperResponse[el]
      })
      return newObject
    } catch (error) {
      this.logger.info(error)
    }
  }
  
  compareCases(storedVersion, scraperResponse) {
    const scraperResponseFormatted = this.formatScraperResponse(scraperResponse)
    const comparisson = Object.keys(scraperResponseFormatted).map((el) => {
      if(!storedVersion.hasOwnProperty(el)) return false
  
      if(typeof scraperResponseFormatted[el] == 'object') {
        return (scraperResponseFormatted[el].length === storedVersion[el].length)
      }
      if(el === 'document_status') {
        return (scraperResponseFormatted[el].trim() === storedVersion[el].trim())
      }
      if(el === 'court') {
        return (scraperResponseFormatted[el] === storedVersion[el]['name'])
      }
    }).reduce((acc, cv) => acc === cv)
    return comparisson
  }
  
  async caseCreator(role, court_id, external_id) {
    let court
    try {
      court = await this.courts.find({ external_id: court_id })
    } catch (error) {
      this.logger.info(error)
      throw new Error(error)
    }
    return new Cases({
      role: role,
      court: court[0],
      external_id: external_id,
      is_active: true
    })
  }

  buildPayload(storedVersion, req) {
    storedVersion['cover'] = req.body['role_search'][0]['cover']
    let role_date = req.body['role_search'][0]['date'].split('/')
    storedVersion['date'] = new Date(role_date[2], role_date[1], role_date[0]).toISOString().split('T')[0]
    storedVersion['document_status'] = req.body['status']
    storedVersion['receptor'] = req.body['receptor']
    storedVersion['pending_docs'] = req.body['pending_docs']
    storedVersion['cause_history'] = req.body['cause_history']
    storedVersion['exhorts'] = req.body['exhorts']
    storedVersion['is_active'] = true
    return storedVersion
  }
}

module.exports = new CaseService()