/* eslint-disable require-jsdoc */
import ReportsModel from '../models/Reports'
import ClientModel from '../models/Clients'
import CasesModel from '../models/Cases'

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
      rep['exhorts_order_date'] = (!rep['exhorts_order_date'] ? [] :
      rep['exhorts_order_date'].sort(this.sortDates).slice(-1))
      rep['exhorts_added_date'] = (!rep['exhorts_added_date'] ? [] :
      rep['exhorts_added_date'].sort(this.sortDates).slice(-1))
      rep['exhorts_details_date'] = (!rep['exhorts_details_date'] ? [] :
      rep['exhorts_details_date'].sort(this.sortDates).slice(-1))
      rep['last_reception'] = (!rep['last_reception'] ? [] :
      rep['last_reception'].sort(this.sortDates).slice(-1))
      rep['book_1'] = (!rep['book_1'] ? [] :
      rep['book_1'].sort(this.sortDates).slice(-1))
      rep['book_2'] = (!rep['book_2'] ? [] :
      rep['book_2'].sort(this.sortDates).slice(-1))
      rep['book_3'] = (!rep['book_3'] ? [] :
      rep['book_3'].sort(this.sortDates).slice(-1))
      rep['last_docs_book_1'] = (!rep['last_docs_book_1'] ? [] :
      rep['last_docs_book_1'].sort(this.sortDates).slice(-1))
      rep['last_docs_book_2'] = (!rep['last_docs_book_2'] ? [] :
      rep['last_docs_book_2'].sort(this.sortDates).slice(-1))
      rep['last_docs_book_3'] = (!rep['last_docs_book_3'] ? [] :
      rep['last_docs_book_3'].sort(this.sortDates).slice(-1))
      return rep
    })
  }

  async add(clientExternalId) {
    const [client]= await this.clients.getClientsId(
        {'external_id': clientExternalId})
    const rawReport = await this.reports.build(client)
    const report = this.applySort(rawReport)
    return await this.reports.add(clientId, report)
  }

  async get(query) {
    return await this.reports.get(query)
  }

  async getReport(query) {
    const report = await CasesModel.buildReport(query)
    return this.applySort(report)
  }
}

module.exports = new Reports(ReportsModel, ClientModel)
