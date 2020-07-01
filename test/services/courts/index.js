process.env.NODE_ENV = 'test'

const chai = require('chai')
const expect = chai.expect
const CourtsService = require('../../../src/services/courts')
const conn = require('../../../src/db/index').default

describe('courts service', () => {
  before((done) => {
    conn.connect()
        .then(() => done())
        .catch((err) => done(err))
  })

  it('should create one court', async () => {
    const court = await CourtsService.add([
      {'name': '3º Juzgado de Letras de Iquique', 'external_id': 11},
    ])

    expect(court).to.be.an('array')
    expect(court[0])
        .to
        .include({'name': '3º Juzgado de Letras de Iquique', 'external_id': 11})
  })

  it('should create many courts', async () => {
    const courts = await CourtsService.add([
      {'name': '3º Juzgado de Letras Civil de Antofagasta',
        'external_id': 1043},
      {'name': '3º Juzgado de Letras de Calama', 'external_id': 685},
      {'name': 'Juzgado de Letras de Colina', 'external_id': 387},
      {'name': '1º Juzgado Civil de San Miguel', 'external_id': 343},
      {'name': 'Juzgado de Letras de Peñaflor', 'external_id': 388},
    ])

    expect(courts).to.be.an('array')
    expect(courts).to.have.lengthOf(5)
  })

  it('should get a court by name', async () => {
    const court = await CourtsService.search(
        {'name': '3º Juzgado de Letras de Iquique'})
    expect(court).to.be.an('array')
    expect(court).to.have.lengthOf(1)
    expect(court[0]).to.include({'name': '3º Juzgado de Letras de Iquique'})
  })

  after(() => {
    conn.drop()
  })
})
