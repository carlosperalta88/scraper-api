/* eslint-disable require-jsdoc */
import Cases from '../models/Cases'
import CasesData from '../models/CasesData'
import CourtSchema from '../models/Courts'
import UserService from '../services/users'
import ClientSchema from '../models/Clients'

class CaseService {
  constructor(Cases, CasesData) {
    this.cases = Cases
    this.casesData = CasesData
  }

  async add(cases) {
    const bla = Promise.all(cases.map(async (item) => this.caseCreator(item)))
        .then(async (items) => {
          const res = await this.cases.create(items)
          Promise.resolve(res)
          return res
        })
        .catch((e) => {
          Promise.reject(e)
        })
    return bla.then((x) => x).catch((e) => console.log(e))
  }

  async caseCreator(cas) {
    [cas['court']] = await CourtSchema.search({external_id: cas['court_id']})
    delete cas['court_id']

    const clients = await ClientSchema.getClientsId(
        {external_id: {$in: cas['clients']}})
    cas['clients'] = clients.map((el) => el['_id'])

    const users = await UserService.getIdBySearch({email: {$in: cas['emails']}})
    cas['users'] = users.map((el) => el['_id'])
    delete cas['emails']

    cas['is_active'] = true
    cas['role'] = cas['role'].trim()
    return cas
  }

  async deleteManyByExternalId(externalIds) {
    return await this.cases.deleteManyByExternalId(externalIds)
  }

  async search(query) {
    return await this.cases.search(query)
  }

  async updateUsers(query, emails) {
    const users = await UserService.getIdBySearch({email: {$in: emails}})
    const usersId = users.map((el) => el['_id'])
    return await this.cases.updateUsers(query, usersId)
  }

  async updateClients(query, clientsEI) {
    const clients = await ClientSchema.getClientsId(
        {external_id: {$in: clientsEI}})
    const clientsId = clients.map((el) => el['_id'])
    return await this.cases.updateClients(query, clientsId)
  }

  async getCaseUsers(query) {
    const users = await this.cases.getCaseUsers(query)
    return users.map((el) => el.email)
  }
}

module.exports = new CaseService(Cases, CasesData)
