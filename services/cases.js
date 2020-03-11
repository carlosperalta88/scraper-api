import Cases from '../models/Cases'
import CasesData from '../models/CasesData'
import logger from '../config/winston'
import Reports from '../models/Reports'
import CourtSchema from '../models/Courts'
import UsersSchema from '../models/Users'
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

  async addManyCases(cases) {
    const bla = await cases.map(async (el) => {
      const [a, b, c] = await Promise.all([
        CourtSchema.search({ external_id: el.court_id }),
        UsersSchema.getIdByEmail({ email: { $in: el.emails } }),
        ClientSchema.getClientsId({ external_id: { $in: el.clients } })
      ])

      el['court'] = a
      el['users'] = b
      el['clients'] = c
      el['is_active'] = true
    })
    console.log(bla.then(x => x))
    return await this.cases.insertMany(bla)
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