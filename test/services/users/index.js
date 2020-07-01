process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = chai.expect
const UsersService = require('../../../src/services/users')
const ClientsService = require('../../../src/services/clients')
const RolesService = require('../../../src/services/roles')
const conn = require('../../../src/db/index').default

describe('users service', () => {
  before(async () => {
    await conn.connect()
    await ClientsService.add({
      'name': 'ZonaSur',
      'external_id': '0',
      'is_active': true,
    })

    await RolesService.add({
      'name': 'admin',
    })
  })

  it('should create an user', async () => {
    const user = await UsersService.add({
      email: 'carlos@test.com',
      client: {external_id: '0'},
      role: {name: 'admin'},
      external_id: 'chichi',
    })
    expect(user).to.be.an('array')
    expect(user[0]).to.include({
      email: 'carlos@test.com',
      external_id: 'chichi',
    })
    expect(user[0]['client']).to.include({
      name: 'ZonaSur',
      external_id: '0',
    })
    expect(user[0]['role']).to.include({
      name: 'admin',
    })
  })

  it('should get an user by email', async () => {
    const user = await UsersService.get('carlos@test.com')
    expect(user).to.be.an('array')
    expect(user[0]).to.include({
      email: 'carlos@test.com',
      external_id: 'chichi',
    })
    expect(user[0]['client']).to.include({
      name: 'ZonaSur',
      external_id: '0',
    })
    expect(user[0]['role']).to.include({
      name: 'admin',
    })
  })

  it('should search an user', async () => {
    const user = await UsersService.search({'client.name': 'ZonaSur'})
    expect(user).to.be.an('array')
    expect(user[0]).to.include({
      email: 'carlos@test.com',
      external_id: 'chichi',
    })
    expect(user[0]['client']).to.include({
      name: 'ZonaSur',
      external_id: '0',
    })
    expect(user[0]['role']).to.include({
      name: 'admin',
    })
  })

  it('should update an user by email', async () => {
    const user = await UsersService.update('carlos@test.com',
        {'external_id': 'chichi1'})
    expect(user).to.be.an('object')
    expect(user).to.include({'external_id': 'chichi1'})
  })

  after(() => {
    conn.drop()
  })
})
