process.env.NODE_ENV = 'test'

import chai from 'chai'
let expect = chai.expect
import CasesServices from '../../../src/services/cases'
import CourtsService from '../../../src/services/courts'
import ClientsService from '../../../src/services/clients'
import RolesService from '../../../src/services/roles'
import UsersService from '../../../src/services/users'
import CasesDataService from '../../../src/services/casesData'
import conn from '../../../src/db/index'
import CasesData from '../../../src/models/CasesData'

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
    await ClientsService.add({
      'name': 'Delloro',
      'external_id': 'RD',
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
    await UsersService.add({
      email: 'carlos2@test.com',
      client: { external_id: '0' },
      role: { name: 'admin' },
      external_id: 'chichi2',
      is_active: true
    })
  })

  
  it('should create a case', () => {
    return CasesServices.add(
      [{ "external_id": "40692", "role":"C-3163-2018", "court_id": 11, "clients":["0"], "emails": ["carlos@test.com"] }]
      )
      .then(result => {
        expect(result).not.to.be.a('null')
        expect(result).to.be.lengthOf(1)
        expect(result[0]).to.include({ "external_id": "40692", "role":"C-3163-2018", "is_active": true })
        expect(result[0]['court']).to.include({
          name: '3º Juzgado de Letras de Iquique',
          external_id: 11
        })
    })
  })
  
  it('should create several cases', () => {
    return CasesServices.add(
      [
        { "external_id": "40694", "role":"C-3163-2018", "court_id": 658, "clients":["0"], "emails": ["carlos@test.com"] },
        { "external_id": "40693", "role":"C-3164-2019", "court_id": 279, "clients":["0"], "emails": ["carlos@test.com"] },
        { "external_id": "322", "role": "C-546-2018", "court_id": 285, "clients": ["0"]}
      ]
      )
      .then(result => {
        expect(result).not.to.be.a('null')
        expect(result).to.be.lengthOf(3)
        expect(result[0]).to.include({ "external_id": "40694", "role":"C-3163-2018", "is_active": true })
        expect(result[0]['court']).to.include({
          name: '3º Juzgado de Letras de Calama',
          external_id: 658
        })
        expect(result[1]).to.include({ "external_id": "40693", "role":"C-3164-2019", "is_active": true })
        expect(result[1]['court']).to.include({
          name: '21º Juzgado Civil de Santiago',
          external_id: 279
        })
      })
    })

  it('should search cases', () => {
    return CasesServices.search(
      { role: { $in: ['C-3163-2018', 'C-3164-2019'] } }
    )
    .then(result => {
      expect(result).not.to.be.a('null')
      expect(result).to.be.lengthOf(3)
      expect(result[0]).to.include({ "external_id": "40692", "role":"C-3163-2018", "is_active": true })
      expect(result[0]['court']).to.include({
        name: '3º Juzgado de Letras de Iquique',
        external_id: 11
      })
      expect(result[1]).to.include({ "external_id": "40694", "role":"C-3163-2018", "is_active": true })
      expect(result[1]['court']).to.include({
        name: '3º Juzgado de Letras de Calama',
        external_id: 658
      })
      expect(result[2]).to.include({ "external_id": "40693", "role":"C-3164-2019", "is_active": true })
      expect(result[2]['court']).to.include({
        name: '21º Juzgado Civil de Santiago',
        external_id: 279
      })
    })
  })

  it('should add user to case', () => {
    return CasesServices.updateUsers({ external_id: "40693"}, ['carlos2@test.com'])
    .then(result => {
      expect(result).not.to.be.a('null')
      expect(result).to.include({ n: 1, nModified: 1, ok: 1 })
    })
  })

  it('should add client to case', () => {
    return CasesServices.updateClients({ external_id: "40693"}, ['RD'])
    .then(result => {
      expect(result).not.to.be.a('null')
      expect(result).to.include({ n: 1, nModified: 1, ok: 1 })
    })
  })

  it('should add scraped data', () => {
    return CasesDataService.add({ body: {
      cause_history: [
        { book: '1 Principal', history: [
          {
            folio:"47",
            doc: "",
            attachment: "",
            stage: "Notificación demanda y su proveído",
            procedure: "Resolución",
            procedure_description: "Archivo del expediente en el Tribunal",
            procedure_date: "05/08/2019",
            document_page: "2"
          },
        ] },
        { book: '2 Apremio Ejecutivo Obligación de Dar', history: [
          {
            folio:"47",
            doc: "",
            attachment: "",
            stage: "Notificación demanda y su proveído",
            procedure: "Resolución",
            procedure_description: "Archivo del expediente en el Tribunal",
            procedure_date: "05/08/2019",
            document_page: "2"
          },
        ] }
      ],
      exhorts: [
        {
          role_origin: 'C-546-2018',
          exhort_type: 'Exhorto',
          role_destination: 'E-808-2018',
          exhort_order_date: '05/04/2018',
          exhort_added_date: '05/04/2018',
          court_destined: '1º Juzgado Civil de Rancagua',
          exhort_status: 'Recepcionado',
          role_destination_detail: [
            { doc: "",
              date: "15/05/2018",
              reference: "Folio:5 Diligenciado con resultado negativo",
              procedure: "Resolución"
            }
          ]
        },
        {
          role_origin: 'C-546-2018',
          exhort_type: 'Exhorto',
          role_destination: 'E-307-2019',
          exhort_order_date: '02/02/2019',
          exhort_added_date: '02/02/2019',
          court_destined: '2º Juzgado Civil de Rancagua',
          exhort_status: 'Generado',
          role_destination_detail: [
            { doc: "",
              date: "15/05/2018",
              reference: "Folio:5 Diligenciado con resultado negativo",
              procedure: "Resolución"
            }
          ]
        },
        {
          role_origin: 'C-546-2018',
          exhort_type: 'Exhorto',
          role_destination: 'E-2562-2018',
          exhort_order_date: '10/10/2018',
          exhort_added_date: '10/10/2018',
          court_destined: '2º Juzgado Civil de Rancagua',
          exhort_status: 'Recepcionado',
          role_destination_detail: [
            { doc: "",
              date: "15/05/2018",
              reference: "Folio:5 Diligenciado con resultado negativo",
              procedure: "Resolución"
            }
          ]
        },
        {
          role_origin: 'C-546-2018',
          exhort_type: 'Exhorto',
          role_destination: 'E-2054-2018',
          exhort_order_date: '13/08/2018',
          exhort_added_date: '13/08/2018',
          court_destined: '1º Juzgado Civil de Rancagua',
          exhort_status: 'Recepcionado',
          role_destination_detail: [
            { doc: "",
              date: "15/05/2018",
              reference: "Folio:5 Diligenciado con resultado negativo",
              procedure: "Resolución"
            }
          ]
        }
      ],
      pending_docs: [
        { book: '1 Principal', docs: [] },
        { book: '2 Apremio Ejecutivo Obligación de Dar', docs: [] }
      ],
      receptor: [ { book: 'Causa no presenta retiro de Receptor.' } ],
      role_search: [
        {
          role: 'C-546-2018 ',
          date: '08/01/2018',
          cover: 'TANNER SERVICIOS FINANCIEROS S.A./MADARIAGA',
          court: '27º Juzgado Civil de Santiago'
        }
      ],
      status: 'Archivada'
    }, 
    params: {
      role: 'C-546-2018'
    }})
    .then(result => {
      expect(result).not.to.be.a('null')
      expect(result[0]).to.has.property('case_id')
      expect(result[0]['cover']).to.equal('TANNER SERVICIOS FINANCIEROS S.A./MADARIAGA')
      expect(result[0]['document_status']).to.equal('Archivada')
    })
    .catch((e) => console.log(e))
  })

  it('should add scraped data', () => {
    return CasesDataService.add({ body: {
      cause_history: [
        { book: '1 Principal', history: [
          {
            folio:"47",
            doc: "",
            attachment: "",
            stage: "Notificación demanda y su proveído",
            procedure: "Resolución",
            procedure_description: "Archivo del expediente en el Tribunal",
            procedure_date: "05/08/2019",
            document_page: "2"
          },
        ] },
        { book: '2 Apremio Ejecutivo Obligación de Dar', history: [
          {
            folio:"47",
            doc: "",
            attachment: "",
            stage: "Notificación demanda y su proveído",
            procedure: "Resolución",
            procedure_description: "Archivo del expediente en el Tribunal",
            procedure_date: "05/08/2019",
            document_page: "2"
          },
        ] }
      ],
      exhorts: [
        {
          role_origin: 'C-546-2018',
          exhort_type: 'Exhorto',
          role_destination: 'E-808-2018',
          exhort_order_date: '05/04/2018',
          exhort_added_date: '05/04/2018',
          court_destined: '1º Juzgado Civil de Rancagua',
          exhort_status: 'Recepcionado',
          role_destination_detail: [
            { doc: "",
              date: "15/05/2018",
              reference: "Folio:5 Diligenciado con resultado negativo",
              procedure: "Resolución"
            }
          ]
        },
        {
          role_origin: 'C-546-2018',
          exhort_type: 'Exhorto',
          role_destination: 'E-307-2019',
          exhort_order_date: '02/02/2019',
          exhort_added_date: '02/02/2019',
          court_destined: '2º Juzgado Civil de Rancagua',
          exhort_status: 'Generado',
          role_destination_detail: [
            { doc: "",
              date: "15/05/2018",
              reference: "Folio:5 Diligenciado con resultado negativo",
              procedure: "Resolución"
            }
          ]
        },
        {
          role_origin: 'C-546-2018',
          exhort_type: 'Exhorto',
          role_destination: 'E-2562-2018',
          exhort_order_date: '10/10/2018',
          exhort_added_date: '10/10/2018',
          court_destined: '2º Juzgado Civil de Rancagua',
          exhort_status: 'Recepcionado',
          role_destination_detail: [
            { doc: "",
              date: "15/05/2018",
              reference: "Folio:5 Diligenciado con resultado negativo",
              procedure: "Resolución"
            }
          ]
        },
        {
          role_origin: 'C-546-2018',
          exhort_type: 'Exhorto',
          role_destination: 'E-2054-2018',
          exhort_order_date: '13/08/2018',
          exhort_added_date: '13/08/2018',
          court_destined: '1º Juzgado Civil de Rancagua',
          exhort_status: 'Recepcionado',
          role_destination_detail: [
            { doc: "",
              date: "15/05/2018",
              reference: "Folio:5 Diligenciado con resultado negativo",
              procedure: "Resolución"
            }
          ]
        }
      ],
      pending_docs: [
        { book: '1 Principal', docs: [] },
        { book: '2 Apremio Ejecutivo Obligación de Dar', docs: [] }
      ],
      receptor: [ { book: 'Causa no presenta retiro de Receptor.' } ],
      role_search: [
        {
          role: 'C-546-2018 ',
          date: '08/01/2018',
          cover: 'TANNER SERVICIOS FINANCIEROS S.A./MADARIAGA',
          court: '27º Juzgado Civil de Santiago'
        }
      ],
      status: 'Archivada'
    }, 
    params: {
      role: 'C-546-2018'
    }})
    .then(result => {
      expect(result).not.to.be.a('null')
      expect(result[0]).to.has.property('case_id')
      expect(result[0]['cover']).to.equal('TANNER SERVICIOS FINANCIEROS S.A./MADARIAGA')
      expect(result[0]['document_status']).to.equal('Archivada')
    })
    .catch((e) => console.log(e))
  })

  it('should find a case with its data', () => {
    return CasesServices.search(
      { role: { $in: ['C-546-2018'] } }
    )
    .then(result => {
      expect(result).not.to.be.a('null')
    })
  })

  it('should deactivate cases', () => {
    return CasesServices.deleteManyByExternalId(["40692", "40693"])
      .then(result => {
        expect(result).not.to.be.a('null')
        expect(result).to.include({ n: 2, nModified: 2, ok: 1 })
      })
  })
    
    after(() => {
      conn.drop()
    })
})