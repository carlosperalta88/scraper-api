import Cases from '../models/Cases'
import CasesData from '../models/CasesData'
import logger from '../config/winston'
import Reports from '../models/Reports'
import CourtSchema from '../models/Courts'
import UserService from '../services/users'
import ClientSchema from '../models/Clients'

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

  async add(cases) {
    const bla = Promise.all(cases.map(async item => this.caseCreator(item)))
    .then(async (items) => {
      const res = await this.cases.add(items)
      Promise.resolve(res)
      return res
    })
    .then(x => x)
    .catch((e) => {
      Promise.reject(e)
    })
    return bla.then(x => x).catch(e => console.log(e))
  }

  async caseCreator(cas) {
    [cas['court']] = await CourtSchema.search({ external_id: cas['court_id'] })
    delete cas['court_id']

    const clients = await ClientSchema.getClientsId({ external_id: { $in: cas['clients'] } })
    cas['clients'] = clients.map(el => el['_id'])

    const users = await UserService.getIdBySearch({ email: { $in: cas['emails'] } })
    cas['users'] = users.map(el => el['_id'])
    delete cas['emails']

    cas['is_active'] = true
    return cas
  }

  async deleteMany(roles) {
    return await this.cases.deleteManyByExternalId(roles)
  }

  async search(query) {
    return await this.cases.search(query)
  }

}

const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x)

module.exports = new CaseService(Cases, logger, CasesData, Reports)