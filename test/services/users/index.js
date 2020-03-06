process.env.NODE_ENV = 'test'

import chai from 'chai'
let expect = chai.expect
import UsersService from '../../../services/users'
import conn from '../../../db/index'

describe('users service', () => {
  before((done) => {
    conn.connect()
      .then(() => done())
      .catch((err) => done(err))
  })

  it('should create an user', async () => {
    const client = await UsersService.add({
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

  it('should get an user by email', async () => {
    const client = await UsersService.get('0')
    expect(client).to.be.an('array')
    expect(client[0]).to.include({
      'name': 'Zona Sur',
      'external_id': '0',
      'is_active': true
    })
  })

  it('should search an user', async () => {
    const client = await UsersService.search({ 'name': 'Zona Sur' })
    expect(client).to.be.an('array')
    expect(client[0]).to.include({
      'name': 'Zona Sur',
      'external_id': '0',
      'is_active': true
    })
  })

  it('should update an user by email', async () => {
    const client = await UsersService.update('0', { 'name': 'ZonaSur' })
    expect(client).to.be.an('object')
    expect(client).to.include({ nModified: 1 })
  })
})