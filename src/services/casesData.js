/* eslint-disable require-jsdoc */
import CasesDataModel from '../models/CasesData'
import Cases from '../models/Cases'
import compose from '../lib/compose'

class CasesData {
  constructor(CasesDataModel) {
    this.casesData = CasesDataModel
  }

  formatScraperResponse(req) {
    try {
      const modelKeys =
        ['court', 'cover', 'date', 'role', 'document_status',
          'receptor', 'pending_docs', 'cause_history', 'exhorts']
      const formattedCase = {}
      modelKeys.forEach((el, elIndex) => {
        if (elIndex < 4) {
          formattedCase[el] = req.body['role_search'][0][el].trim()
          return
        }

        if (elIndex === 4) {
          formattedCase[el] = req.body['status']
          return
        }

        formattedCase[el] = req.body[el]
      })
      return formattedCase
    } catch (error) {
      this.logger.info(error)
    }
  }

  formatDate(formattedCase) {
    const roleDate = formattedCase['date'].split('/')
    formattedCase['date'] =
    new Date(roleDate[2],
        roleDate[1]-1,
        roleDate[0])
        .toISOString().split('T')[0]
    return formattedCase
  }

  async add(req) {
    const payload = compose(this.formatDate, this.formatScraperResponse)(req)
    const re = /\s\w/gm
    const role = (re.test(req.params.role) ?
    req.params.role.split(' ')[0] : req.params.role)
    const [parentCase] = await Cases.getCaseId(
        {$and: [{role: role.trim()}, {'court.name': payload['court']}]})
    payload['case_id'] = parentCase['id']
    return await this.casesData.create(payload)
  }

  async getLatest(caseId) {
    return await this.casesData.getLatest({caseId})
  }

  compare(newCase, oldCase) {
    const variation = []
    const checkProperties =
      ['receptor',
        'pending_docs',
        'cause_history',
        'exhorts']
    for (const property of checkProperties) {
      if (this.didItChange(newCase[property], oldCase[property])) {
        variation.push(property)
      }
    }

    if (variation.length === 0) {
      return {case_id: newCase['case_id'], variation}
    }

    return {case_id: newCase['case_id'], variation}
  }

  didItChange(propA, propB) {
    return this.processProp(propA) !== this.processProp(propB)
  }

  processProp(prop) {
    return compose(this.getLength, this.noWS, this.toString)(prop)
  }

  toString(obj) {
    return JSON.stringify(obj)
  }

  noWS(str) {
    return str.replace(/\s/g, '');
  }

  getLength(str) {
    return str.length
  }
}

module.exports = new CasesData(CasesDataModel)
