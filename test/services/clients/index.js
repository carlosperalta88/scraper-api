process.env.NODE_ENV = 'test'

import chai from 'chai'
let expect = chai.expect
import ClientsService from '../../../services/clients'
import conn from '../../../db/index'

describe('clients service', () => {
  before((done) => {
    conn.connect()
      .then(() => done())
      .catch((err) => done(err))
  })

  it('should create a client', async () => {
    const client = await ClientsService.add({
      'name': 'Zona Sur',
      'external_id': '0',
      'is_active': true
    })
    expect(client).to.be.an('object')
    expect(client).to.include({
      'name': 'Zona Sur',
      'external_id': '0',
      'is_active': true
    })
  })

  it('should get a client by external id', async () => {
    const client = await ClientsService.get('0')
    expect(client).to.be.an('array')
    expect(client[0]).to.include({
      'name': 'Zona Sur',
      'external_id': '0',
      'is_active': true
    })
  })

  it('should search a client by name', async () => {
    const client = await ClientsService.search({ 'name': 'Zona Sur' })
    expect(client).to.be.an('array')
    expect(client[0]).to.include({
      'name': 'Zona Sur',
      'external_id': '0',
      'is_active': true
    })
  })

  it('should update a client by external id', async () => {
    const client = await ClientsService.update('0', { 'name': 'ZonaSur' })
    expect(client).to.be.an('object')
    expect(client).to.include({ nModified: 1 })
  })
})