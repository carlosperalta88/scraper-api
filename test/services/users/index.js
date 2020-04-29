process.env.NODE_ENV = 'test'

import chai from 'chai'
let expect = chai.expect
import UsersService from '../../../src/services/users'
import conn from '../../../src/db/index'

describe('users service', () => {
  before((done) => {
    conn.connect()
      .then(() => done())
      .catch((err) => done(err))
  })

  it('should create an user', async () => {
    const user = await UsersService.add({
      email: 'carlos@test.com',
      client: { external_id: '0' },
      role: { name: 'admin' },
      external_id: 'chichi',
    })
    expect(user).to.be.an('object')
    expect(user).to.include({
      email: 'carlos@test.com',
      external_id: 'chichi'
    })
    expect(user['client']).to.include({
      name: 'ZonaSur',
      external_id: '0',
    })
    expect(user['role']).to.include({
      name: 'admin'
    })
  })

  it('should get an user by email', async () => {
    const user = await UsersService.get('carlos@test.com')
    expect(user).to.be.an('array')
    expect(user[0]).to.include({
      email: 'carlos@test.com',
      external_id: 'chichi'
    })
    expect(user[0]['client']).to.include({
      name: 'ZonaSur',
      external_id: '0',
    })
    expect(user[0]['role']).to.include({
      name: 'admin'
    })
  })

  it('should search an user', async () => {
    const user = await UsersService.search({ 'client.name': 'ZonaSur' })
    expect(user).to.be.an('array')
    expect(user[0]).to.include({
      email: 'carlos@test.com',
      external_id: 'chichi'
    })
    expect(user[0]['client']).to.include({
      name: 'ZonaSur',
      external_id: '0',
    })
    expect(user[0]['role']).to.include({
      name: 'admin'
    })
  })

  it('should update an user by email', async () => {
    const user = await UsersService.update('carlos@test.com', { 'external_id': 'chichi1' })
    expect(user).to.be.an('object')
    expect(user).to.include({ nModified: 1 })
  })
})