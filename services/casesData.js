import CasesDataModel from '../models/CasesData'

class CasesData {
  constructor(CasesDataModel) {
    this.casesData = CasesDataModel
  }

  formatScraperResponse(req) {
    try {
      const modelKeys = ['court','cover','role','document_status','receptor','pending_docs','cause_history','exhorts']
      const formattedCase = new Object()
      modelKeys.forEach((el, elIndex) => {
        if(elIndex < 3) {
          formattedCase[el] = req.body['role_search'][0][el].trim()
          return
        }
  
        if(elIndex === 3) {
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

  buildCaseData(formattedCase) {
    const caseData = {}
    caseData['cover'] = formattedCase['role_search'][0]['cover']
    let role_date = formattedCase['role_search'][0]['date'].split('/')
    caseData['date'] = new Date(role_date[2], role_date[1]-1, role_date[0]).toISOString().split('T')[0]
    caseData['document_status'] = formattedCase['status']
    caseData['receptor'] = formattedCase['receptor']
    caseData['pending_docs'] = formattedCase['pending_docs']
    caseData['cause_history'] = formattedCase['cause_history']
    caseData['exhorts'] = formattedCase['exhorts']
    return caseData
  }

  async add(req) {
    const payload = compose(this.buildCaseData, this.formatScraperResponse)(req)
    return await this.casesData.add(req.params.role, payload['court']['name'], payload)
  }
}

const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x)

exports.module = new CasesData(CasesDataModel)