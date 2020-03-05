import Cases from '../models/Cases'
import CasesData from '../models/CasesData'
import logger from '../config/winston'
import Reports from '../models/Reports'

class CaseService {
  constructor(Cases, logger, CasesData, Reports) {
    this.cases = Cases
    this.logger = logger
    this.casesData = CasesData
    this.reports = Reports
  }

  sortDates(dateA, dateB) {
    if (dateA > dateB) return 1
    if (dateA < dateB) return -1
    return 0
  }

  applySort(listOfCases) {
    return listOfCases.map((rep) => {
      rep['exhorts_order_date'] = (!rep['exhorts_order_date'] ? [] : rep['exhorts_order_date'].sort(this.sortDates).slice(-1))
      rep['exhorts_added_date'] = (!rep['exhorts_added_date'] ? [] : rep['exhorts_added_date'].sort(this.sortDates).slice(-1))
      rep['exhorts_details_date'] = (!rep['exhorts_details_date'] ? [] : rep['exhorts_details_date'].sort(this.sortDates).slice(-1))
      rep['last_reception'] = (!rep['last_reception'] ? [] : rep['last_reception'].sort(this.sortDates).slice(-1))
      rep['book_1'] = (!rep['book_1'] ? [] : rep['book_1'].sort(this.sortDates).slice(-1))
      rep['book_2'] = (!rep['book_2'] ? [] : rep['book_2'].sort(this.sortDates).slice(-1))
      rep['book_3'] = (!rep['book_3'] ? [] : rep['book_3'].sort(this.sortDates).slice(-1))
      rep['last_docs_book_1'] = (!rep['last_docs_book_1'] ? [] : rep['last_docs_book_1'].sort(this.sortDates).slice(-1))
      rep['last_docs_book_2'] = (!rep['last_docs_book_2'] ? [] : rep['last_docs_book_2'].sort(this.sortDates).slice(-1))
      rep['last_docs_book_3'] = (!rep['last_docs_book_3'] ? [] : rep['last_docs_book_3'].sort(this.sortDates).slice(-1))
      return rep
    })
  }

  async createClientReport(client) {
    return await this.reports.insert({ client })
  }

  async aggregateByClient(client) {
    const roles = await this.reports.build(client)
    return this.applySort(roles)
  }

  async caseCreator(data) {
    return await this.cases.caseCreator(data)
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

  async updateCase(req) {
    const payload = compose(this.buildCaseData, this.formatScraperResponse)(req)
    return await this.casesData.add(req.params.role, payload['court']['name'], payload)
  }

  async deleteMany(roles) {
    return await this.cases.deleteManyByExternalId(roles)
  }

}

const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x)

module.exports = new CaseService(Cases, logger, CasesData, Reports)