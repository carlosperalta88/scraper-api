import ReportsModel from '../models/Reports'
import ClientModel from '../models/Clients'

class Reports {
  constructor(ReportsModel, ClientModel) {
    this.reports = ReportsModel
    this.clients = ClientModel
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

  async add(client) {
    const {clientId} = this.clients.getClientsId(client)
    const report = compose(this.applySort, await this.reports.build)(client)
    return await this.reports.add(clientId, report)
  }

  async get(query) {
    return await this.reports.get(query)
  }
}

const compose = (...fns) => x => fns.reduceRight((y, f) => f(y), x)

module.exports = new Reports(ReportsModel, ClientModel)