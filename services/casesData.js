import CasesDataModel from '../models/CasesData'
import Cases from '../models/Cases'
import ObservableInsert from '../observers/Insert'

class CasesData {
  constructor(CasesDataModel) {
    this.casesData = CasesDataModel
  }

  formatScraperResponse(req) {
    try {
      const modelKeys = ['court','cover','date','role','document_status','receptor','pending_docs','cause_history','exhorts']
      const formattedCase = new Object()
      modelKeys.forEach((el, elIndex) => {
        if(elIndex < 4) {
          formattedCase[el] = req.body['role_search'][0][el].trim()
          return
        }
  
        if(elIndex === 4) {
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
    let role_date = formattedCase['date'].split('/')
    formattedCase['date'] = new Date(role_date[2], role_date[1]-1, role_date[0]).toISOString().split('T')[0]
    return formattedCase
  }

  async add(req) {
    const payload = compose(this.formatDate, this.formatScraperResponse)(req)
    let [parent_case] = await Cases.getCaseId({ $and: [{ role: req.params.role.trim() }, { 'court.name': payload['court'] }] })
    payload['case_id'] = parent_case
    ObservableInsert.checkInsert(payload)
    return await this.casesData.add(payload)
  }
}

const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x)

module.exports = new CasesData(CasesDataModel)