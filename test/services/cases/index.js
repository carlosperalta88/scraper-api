process.env.NODE_ENV = 'test'

import chai from 'chai'
let expect = chai.expect
import CasesServices from '../../../services/cases'
import CourtsService from '../../../services/courts'
import ClientsService from '../../../services/clients'
import RolesService from '../../../services/roles'
import UsersService from '../../../services/users'
import conn from '../../../db/index'

describe('cases service', function() {
  before(async () => {
    await conn.connect()
    await RolesService.add({
      'name': 'admin'
    })
    await ClientsService.add({
      'name': 'ZonaSur',
      'external_id': '0',
      'is_active': true
    })
    await CourtsService.add([
      {"name":"5º Juzgado Civil de Santiago","external_id":"263"},
      {"name":"20º Juzgado Civil de Santiago","external_id":"278"},
      {"name":"9º Juzgado Civil de Santiago","external_id":"267"},
      {"name":"22º Juzgado Civil de Santiago","external_id":"280"},
      {"name":"15º Juzgado Civil de Santiago","external_id":"273"},
      {"name":"4º Juzgado Civil de Santiago","external_id":"262"},
      {"name":"1º Juzgado Civil de Santiago","external_id":"259"},
      {"name":"13º Juzgado Civil de Santiago","external_id":"271"},
      {"name":"18º Juzgado Civil de Santiago","external_id":"276"},
      {"name":"21º Juzgado Civil de Santiago","external_id":"279"},
      {"name":"19º Juzgado Civil de Santiago","external_id":"277"},
      {"name":"24º Juzgado Civil de Santiago","external_id":"282"},
      {"name":"12º Juzgado Civil de Santiago","external_id":"270"},
      {"name":"14º Juzgado Civil de Santiago","external_id":"272"},
      {"name":"17º Juzgado Civil de Santiago","external_id":"275"},
      {"name":"28º Juzgado Civil de Santiago","external_id":"286"},
      {"name":"2º Juzgado Civil de Santiago","external_id":"260"},
      {"name":"3º Juzgado Civil de Santiago","external_id":"261"},
      {"name":"6º Juzgado Civil de Santiago","external_id":"264"},
      {"name":"8º Juzgado Civil de Santiago","external_id":"266"},
      {"name":"23º Juzgado Civil de Santiago","external_id":"281"},
      {"name":"10º Juzgado Civil de Santiago","external_id":"268"},
      {"name":"11º Juzgado Civil de Santiago","external_id":"269"},
      {"name":"16º Juzgado Civil de Santiago","external_id":"274"},
      {"name":"7º Juzgado Civil de Santiago","external_id":"265"},
      {"name":"29º Juzgado Civil de Santiago","external_id":"287"},
      {"name":"30º Juzgado Civil de Santiago","external_id":"288"},
      {"name":"26º Juzgado Civil de Santiago","external_id":"284"},
      {"name":"25º Juzgado Civil de Santiago","external_id":"283"},
      {"name":"27º Juzgado Civil de Santiago","external_id":"285"},
      {"name":"Juzgado de Letras de Colina","external_id":"387"},
      {"name":"3º Juzgado de Letras de Iquique","external_id":"11"},
      {"name":"1º Juzgado Civil de San Miguel","external_id":"343"},
      {"name":"Juzgado de Letras de Peñaflor","external_id":"388"},
      {"name":"3º Juzgado de Letras de Calama","external_id":"658"},
      {"name":"3º Juzgado de Letras Civil de Antofagasta","external_id":"1043"}
    ])
    await UsersService.add({
      email: 'carlos@test.com',
      client: { external_id: '0' },
      role: { name: 'admin' },
      external_id: 'chichi',
      is_active: true
    })
  })

  
  it('should create a case', () => {
    return CasesServices.add(
      [{ "external_id": "40692", "role":"C-3163-2018", "court_id": 11, "clients":["0"], "emails": ["carlos@test.com"] }]
      )
      .then(result => {
        expect(result).not.to.be.a('null')
      })
    })
    
    after(() => {
      conn.drop()
    })
})