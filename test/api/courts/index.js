process.env.NODE_ENV = 'test'

const expect = require('chai').expect
const request = require('supertest')

const app = require('../../../app')
const conn = require('../../../db/index')

describe('Create and retreive courts', () => {
  before((done) => {
    conn.connect()
      .then(() => done())
      .catch((err) => done(err))
  })

  it('creates a new court', (done) => {
    request(app).post('/api/v1/courts/add')
    .send({
      name: '2º Juzgado De Letras de Arica ex 4°',
      external_id: 1401
    })
    .then((res) => {
      const body = res.body
      expect(body).to.contain.property('_id')
      expect(body).to.contain.property('name')
      expect(body).to.contain.property('external_id')
      done()
    })
    .catch((err) => done(err))
  })

  it('creates more than one court', (done) => {
    request(app).post('/api/v1/courts/addMany')
    .send([{
      name: '2º Juzgado de Letras de Arica',
      external_id: 3
    },{
      name: '1º Juzgado De Letras de Arica ex 4°',
      external_id: 1400
    },
    ])
    .then((res) => {
      const body = res.body
      expect(body).to.be.an('array')
      expect(body).to.have.length(2)
      expect(body[0]).to.contain.property('_id')
      expect(body[0]).to.contain.property('name')
      expect(body[0]).to.contain.property('external_id')
      done()
    })
    .catch((err) => done(err))
  })

  it('get court', async () => {
    const url = `/api/v1/courts/2`
    const res = await request(app).get(url)
    const body = res.body
    expect(body).to.be.an('array')
    expect(body).to.have.length(1)
    expect(body[0]).to.contain.property('_id')
    expect(body[0]).to.contain.property('name')
    expect(body[0]).to.contain.property('external_id')
  })

  after((done) => {
    conn.close()
      .then(() => done())
      .catch((err) => done(err))
  })
})