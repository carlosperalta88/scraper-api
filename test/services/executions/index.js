process.env.NODE_ENV = 'test'

const expect = require('chai').expect
const ExecutionService = require('../../../src/services/executions').default
const CasesDataService = require('../../../src/services/casesData')
const CasesService = require('../../../src/services/cases')
const UsersService = require('../../../src/services/users')
const CourtsService = require('../../../src/services/courts')
const ClientsService = require('../../../src/services/clients')
const mockData = require('./mockData')
const conn = require('../../../src/db/index').default

describe('Execution service', () => {
  let executionId

  before(async () => {
    await conn.connect()
    await ClientsService.add(mockData.clients.zonaSur)
    await CourtsService.add(mockData.courts)
    await UsersService.add(mockData.user)
    await CasesService.add(mockData.case)
    await CasesDataService.add(mockData.caseDataA)
    await CasesDataService.add(mockData.caseDataB)
    await CasesDataService.add(mockData.caseDataC)
  })

  it('create execution', () => {
    return ExecutionService.create()
        .then((result) => {
          executionId = result[0]['_id']
          expect(result).not.to.be.a('null')
        })
        .catch((err) => console.error(err))
  });

  it('patch an execution', () => {
    return ExecutionService.patch(executionId, ['40692'])
        .then((result) => {
          expect(result).not.to.be.a('null')
        })
        .catch((err) => console.error(err))
  })

  it('get which properties changed', () => {
    return ExecutionService.getChanges(executionId)
        .then((result) => {
          expect(result).not.to.be.a('null')
        })
        .catch((err) => console.error(err))
  })

  after(() => {
    conn.drop()
  })
});

