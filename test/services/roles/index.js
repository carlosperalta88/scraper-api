process.env.NODE_ENV = 'test'

import chai from 'chai'
let expect = chai.expect
import RolesService from '../../../src/services/roles'
import conn from '../../../src/db/index'

describe('roles service', () => {
  before((done) => {
    conn.connect()
      .then(() => done())
      .catch((err) => done(err))
  })

  it('should add a role', async () => {
    const role = await RolesService.add({
      'name': 'admin'
    })
    expect(role).to.be.an('object')
    expect(role).to.include({ 'name': 'admin' })
  })

  it('should get a role by name', async () => {
    const role = await RolesService.get("admin")
    expect(role).to.be.an('array')
    expect(role).to.have.lengthOf(1)
    expect(role[0]).to.include({ 'name': 'admin' })
  })
})