process.env.NODE_ENV = 'test'

const expect = require('chai').expect
const request = require('supertest')

const app = require('../../../app')
const conn = require('../../../db/index')

describe('CRUD Cases success', () => {
  before((done) => {
    conn.connect()
      .then(() => done())
      .catch((err) => done(err))
  })

  it('creates a case', async () => {
    const court = await request(app).post('/api/v1/courts/add').send({
      name: '1º Juzgado de Letras de Arica',
      external_id: 2
    })

    const res = await request(app).post('/api/v1/cases/add')
    .send({
      role: 'C-9585-2017',
      court_id: 2
    })
    const body = res.body
    expect(body).to.contain.property('_id')
    expect(body).to.contain.property('role')
    expect(body['role']).to.eql('C-9585-2017')
    expect(body['court']).to.eql({ _id: court.body._id, name: '1º Juzgado de Letras de Arica', external_id: 2, __v: 0 })
  })

  it('updates a case', async () => {
    const updatedCase = await request(app).patch('/api/v1/cases/C-9585-2017/update')
      .send({
        "cause_history": [
          {
            "book": "1 Principal",
            "history": [
              {
                "attachment": "",
                "doc": "",
                "document_page": "18",
                "folio": "22",
                "procedure": "(CER)Certificacion",
                "procedure_date": "24/05/2019",
                "procedure_description": "Certifica que no se opuso excepciones",
                "stage": "Excepciones"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "17",
                "folio": "21",
                "procedure": "Resolución",
                "procedure_date": "24/04/2019",
                "procedure_description": "Certifíquese",
                "stage": "Notificación demanda y su proveído"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "16",
                "folio": "20",
                "procedure": "Escrito",
                "procedure_date": "21/03/2019",
                "procedure_description": "Certificación que se indica",
                "stage": "Notificación demanda y su proveído"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "0",
                "folio": "19",
                "procedure": "Actuación Receptor",
                "procedure_date": "03/12/2018 (29/11/2018)",
                "procedure_description": "NOTIFICACIÓN DE DEMANDA (Receptor) Diligencia:29/11/2018",
                "stage": "Notificación demanda y su proveído"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "15",
                "folio": "18",
                "procedure": "Resolución",
                "procedure_date": "14/11/2018",
                "procedure_description": "Notificación por art. 44 C.P.C.",
                "stage": "Notificación demanda y su proveído"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "14",
                "folio": "17",
                "procedure": "Escrito",
                "procedure_date": "08/11/2018",
                "procedure_description": "Notificación por art. 44",
                "stage": "Notificación demanda y su proveído"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "0",
                "folio": "16",
                "procedure": "Actuación Receptor",
                "procedure_date": "30/10/2018 (27/10/2018)",
                "procedure_description": "CERTIFICACIÓN BÚSQUEDAS (Receptor) Diligencia:27/10/2018",
                "stage": "Notificación demanda y su proveído"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "0",
                "folio": "15",
                "procedure": "Actuación Receptor",
                "procedure_date": "30/10/2018 (25/10/2018)",
                "procedure_description": "CERTIFICACIÓN BÚSQUEDAS (Receptor) Diligencia:25/10/2018",
                "stage": "Notificación demanda y su proveído"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "13",
                "folio": "14",
                "procedure": "Resolución",
                "procedure_date": "16/10/2018",
                "procedure_description": "Ordena despachar mandamiento",
                "stage": "Ingreso"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "13",
                "folio": "14",
                "procedure": "",
                "procedure_date": "16/10/2018",
                "procedure_description": "Designación Martillero",
                "stage": ""
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "12",
                "folio": "13",
                "procedure": "Escrito",
                "procedure_date": "21/09/2018",
                "procedure_description": "Cumple lo ordenado",
                "stage": "Ingreso"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "11",
                "folio": "12",
                "procedure": "Resolución",
                "procedure_date": "20/04/2018",
                "procedure_description": "Pospone inicio de la tramitación",
                "stage": "Ingreso"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "10",
                "folio": "11",
                "procedure": "Escrito",
                "procedure_date": "03/04/2018",
                "procedure_description": "Cumple lo ordenado",
                "stage": "Ingreso"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "9",
                "folio": "10",
                "procedure": "Resolución",
                "procedure_date": "17/11/2017",
                "procedure_description": "Pospone inicio de la tramitación",
                "stage": "Ingreso"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "8",
                "folio": "9",
                "procedure": "Escrito",
                "procedure_date": "29/09/2017",
                "procedure_description": "Cumple lo ordenado",
                "stage": "Ingreso"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "7",
                "folio": "8",
                "procedure": "Resolución",
                "procedure_date": "21/08/2017",
                "procedure_description": "Pospone inicio de la tramitación",
                "stage": "Ingreso"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "6",
                "folio": "7",
                "procedure": "Escrito",
                "procedure_date": "21/07/2017",
                "procedure_description": "Cumple lo ordenado",
                "stage": "Ingreso"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "5",
                "folio": "6",
                "procedure": "Resolución",
                "procedure_date": "12/07/2017",
                "procedure_description": "Pospone inicio de la tramitación",
                "stage": "Ingreso"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "4",
                "folio": "5",
                "procedure": "Escrito",
                "procedure_date": "17/05/2017",
                "procedure_description": "Curso progresivo a los autos",
                "stage": "Ingreso"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "3",
                "folio": "4",
                "procedure": "",
                "procedure_date": "15/05/2017",
                "procedure_description": "Actuación",
                "stage": "Ingreso"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "0",
                "folio": "3",
                "procedure": "",
                "procedure_date": "15/05/2017",
                "procedure_description": "Acredita Poder",
                "stage": "Ingreso"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "2",
                "folio": "2",
                "procedure": "Resolución",
                "procedure_date": "12/05/2017",
                "procedure_description": "Apercibimiento poder y/o título",
                "stage": "Ingreso"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "1",
                "folio": "1",
                "procedure": "Escrito",
                "procedure_date": "11/05/2017",
                "procedure_description": "Ingreso demanda",
                "stage": "Ingreso"
              }
            ]
          },
          {
            "book": "2 Apremio Ejecutivo Obligación de Dar",
            "history": [
              {
                "attachment": "",
                "doc": "",
                "document_page": "29",
                "folio": "19",
                "procedure": "Resolución",
                "procedure_date": "15/10/2019",
                "procedure_description": "Ofíciese",
                "stage": "Apremio"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "29",
                "folio": "",
                "procedure": "Oficio",
                "procedure_date": "15/10/2019",
                "procedure_description": "De retiro de vehículo",
                "stage": "Apremio"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "29",
                "folio": "19",
                "procedure": "Resolución",
                "procedure_date": "15/10/2019",
                "procedure_description": "Accede al retiro con fuerza pública",
                "stage": "Apremio"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "28",
                "folio": "18",
                "procedure": "Escrito",
                "procedure_date": "03/10/2019",
                "procedure_description": "Cumple lo ordenado",
                "stage": "Terminada"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "27",
                "folio": "17",
                "procedure": "Resolución",
                "procedure_date": "12/09/2019",
                "procedure_description": "Previo a proveer",
                "stage": "Apremio"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "26",
                "folio": "16",
                "procedure": "Escrito",
                "procedure_date": "02/09/2019",
                "procedure_description": "Solicita fuerza pública",
                "stage": "Terminada"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "25",
                "folio": "15",
                "procedure": "Escrito",
                "procedure_date": "22/08/2019",
                "procedure_description": "Solicita exhorto",
                "stage": "Terminada"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "0",
                "folio": "14",
                "procedure": "Actuación Receptor",
                "procedure_date": "22/08/2019 (20/08/2019)",
                "procedure_description": "OPOSICIÓN A RETIRO (Receptor) Diligencia:20/08/2019",
                "stage": "Apremio"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "24",
                "folio": "13",
                "procedure": "Resolución",
                "procedure_date": "19/07/2019",
                "procedure_description": "Mero trámite",
                "stage": "Apremio"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "23",
                "folio": "12",
                "procedure": "Resolución",
                "procedure_date": "17/07/2019",
                "procedure_description": "Mero trámite",
                "stage": "Apremio"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "22",
                "folio": "11",
                "procedure": "Escrito",
                "procedure_date": "01/07/2019",
                "procedure_description": "Solicita fuerza pública",
                "stage": "Terminada"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "21",
                "folio": "10",
                "procedure": "Escrito",
                "procedure_date": "24/06/2019",
                "procedure_description": "Acepta Cargo",
                "stage": "Terminada"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "20",
                "folio": "9",
                "procedure": "Resolución",
                "procedure_date": "19/06/2019",
                "procedure_description": "Designa nuevo martillero",
                "stage": "Apremio"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "19",
                "folio": "8",
                "procedure": "Escrito",
                "procedure_date": "17/06/2019",
                "procedure_description": "Designación de Martillero",
                "stage": "Terminada"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "0",
                "folio": "7",
                "procedure": "Actuación Receptor",
                "procedure_date": "17/05/2019 (15/05/2019)",
                "procedure_description": "Notificación por cédula de otras resoluciones (Receptor) Diligencia:15/05/2019",
                "stage": "Apremio"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "18",
                "folio": "6",
                "procedure": "Resolución",
                "procedure_date": "03/05/2019",
                "procedure_description": "Designa martillero",
                "stage": "Apremio"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "17",
                "folio": "5",
                "procedure": "(REQ)Requerimiento de Pago",
                "procedure_date": "02/05/2019",
                "procedure_description": "Requerimiento de pago",
                "stage": "Mandamiento"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "16",
                "folio": "4",
                "procedure": "Escrito",
                "procedure_date": "21/03/2019",
                "procedure_description": "Designación de Martillero",
                "stage": "Notificación demanda y su proveído"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "0",
                "folio": "3",
                "procedure": "Actuación Receptor",
                "procedure_date": "06/02/2019 (01/02/2019)",
                "procedure_description": "EMBARGO (Receptor) Diligencia:01/02/2019",
                "stage": "Mandamiento"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "0",
                "folio": "2",
                "procedure": "Actuación Receptor",
                "procedure_date": "03/12/2018 (03/12/2018)",
                "procedure_description": "Requerimiento de Pago (Receptor) Diligencia:03/12/2018",
                "stage": "Mandamiento"
              },
              {
                "attachment": "",
                "doc": "",
                "document_page": "1",
                "folio": "1",
                "procedure": "",
                "procedure_date": "16/10/2018",
                "procedure_description": "Mandamiento",
                "stage": "Mandamiento"
              }
            ]
          }
        ],
        "exhorts": [],
        "pending_docs": [],
        "receptor": [
          {
            "book": "Apremio Ejecutivo Obligación de Dar",
            "retrieve_data": "ROSA NEIRA OBREQUE -  13/08/2019.",
            "status": "Resuelta"
          },
          {
            "book": "Apremio Ejecutivo Obligación de Dar",
            "retrieve_data": "MARCO ANTONIO MORALES DONOSO -  13/05/2019.",
            "status": "Eliminado"
          },
          {
            "book": "Apremio Ejecutivo Obligación de Dar",
            "retrieve_data": "MARCO ANTONIO MORALES DONOSO -  13/05/2019.",
            "status": "Resuelta"
          },
          {
            "book": "Apremio Ejecutivo Obligación de Dar",
            "retrieve_data": "MARCO ANTONIO MORALES DONOSO -  31/01/2019.",
            "status": "Resuelta"
          },
          {
            "book": "Apremio Ejecutivo Obligación de Dar",
            "retrieve_data": "ROSA NEIRA OBREQUE -  03/12/2018.",
            "status": "Pendiente"
          },
          {
            "book": "Principal",
            "retrieve_data": "MARCO ANTONIO MORALES DONOSO -  28/11/2018.",
            "status": "Resuelta"
          },
          {
            "book": "Apremio Ejecutivo Obligación de Dar",
            "retrieve_data": "MARCO ANTONIO MORALES DONOSO -  28/11/2018.",
            "status": "Resuelta"
          },
          {
            "book": "Apremio Ejecutivo Obligación de Dar",
            "retrieve_data": "MARCO ANTONIO MORALES DONOSO -  28/11/2018.",
            "status": "Eliminado"
          },
          {
            "book": "Principal",
            "retrieve_data": "MARCO ANTONIO MORALES DONOSO -  26/10/2018.",
            "status": "Resuelta"
          },
          {
            "book": "Apremio Ejecutivo Obligación de Dar",
            "retrieve_data": "MARCO ANTONIO MORALES DONOSO -  23/10/2018.",
            "status": "Eliminado"
          },
          {
            "book": "Principal",
            "retrieve_data": "MARCO ANTONIO MORALES DONOSO -  23/10/2018.",
            "status": "Resuelta"
          }
        ],
        "role_search": [
          {
            "court": "27º Juzgado Civil de Santiago",
            "cover": "TANNER SERVICIOS FINANCIEROS/GALAZ",
            "date": "11/05/2017",
            "role": "C-9585-2017 "
          }
        ],
        "status": "Sin archivar"
      })

      const body = updatedCase.body
      expect(body).to.have.keys(['cause_history', 'exhorts', 'pending_docs', 'receptor', 'document_status', '_id', '__v',
                                'court', 'cover', 'date', 'is_active', 'updated_at', 'users', 'role'])
      expect(body['receptor']).to.have.length(11)
      expect(body['receptor'][0]).to.have.keys(['book', 'retrieve_data', 'status'])
      expect(body['cause_history']).to.have.length(2)
      expect(body['cause_history'][0]).to.have.keys(['book', 'history'])
      expect(body['cause_history'][1]).to.have.keys(['book', 'history'])
      expect(body['cause_history'][0]['history']).to.have.length(23)
      expect(body['cause_history'][1]['history']).to.have.length(21)
      expect(body['cause_history'][0]['history'][0]).to.have.keys(['attachment', 'doc', 'document_page', 'folio', 'procedure', 'procedure_date', 'procedure_description', 'stage'])
      expect(body['cause_history'][1]['history'][0]).to.have.keys(['attachment', 'doc', 'document_page', 'folio', 'procedure', 'procedure_date', 'procedure_description', 'stage'])
      expect(body['pending_docs']).to.have.length(0)
      expect(body['users']).to.have.length(0)
      expect(body['role']).to.eql('C-9585-2017')
      expect(body['cover']).to.eql('TANNER SERVICIOS FINANCIEROS/GALAZ')
      expect(body['court']['name']).to.eql('1º Juzgado de Letras de Arica')
      expect(body['document_status']).to.eql('Sin archivar')
  })

  it('gets a case', async () => {
    const getCase = await request(app).get('/api/v1/cases/C-9585-2017')
    const [body] = getCase.body
    expect(body).to.have.keys(['cause_history', 'exhorts', 'pending_docs', 'receptor', 'document_status', '_id', '__v',
                              'court', 'cover', 'date', 'is_active', 'updated_at', 'users', 'role'])
    expect(body['receptor']).to.have.length(11)
    expect(body['receptor'][0]).to.have.keys(['book', 'retrieve_data', 'status'])
    expect(body['cause_history']).to.have.length(2)
    expect(body['cause_history'][0]).to.have.keys(['book', 'history'])
    expect(body['cause_history'][1]).to.have.keys(['book', 'history'])
    expect(body['cause_history'][0]['history']).to.have.length(23)
    expect(body['cause_history'][1]['history']).to.have.length(21)
    expect(body['cause_history'][0]['history'][0]).to.have.keys(['attachment', 'doc', 'document_page', 'folio', 'procedure', 'procedure_date', 'procedure_description', 'stage'])
    expect(body['cause_history'][1]['history'][0]).to.have.keys(['attachment', 'doc', 'document_page', 'folio', 'procedure', 'procedure_date', 'procedure_description', 'stage'])
    expect(body['pending_docs']).to.have.length(0)
    expect(body['users']).to.have.length(0)
    expect(body['role']).to.eql('C-9585-2017')
    expect(body['cover']).to.eql('TANNER SERVICIOS FINANCIEROS/GALAZ')
    expect(body['court']['name']).to.eql('1º Juzgado de Letras de Arica')
    expect(body['document_status']).to.eql('Sin archivar')
  })

  it('deletes a case', async () => {
    const deletedCase = await request(app).delete('/api/v1/cases/C-9585-2017')
    const body = deletedCase.body
    expect(body).to.have.keys(['n', 'nModified', 'ok'])
    expect(body['n']).to.be.eql(1)
    expect(body['nModified']).to.be.eql(1)
    expect(body['ok']).to.be.eql(1)
  })

  after((done) => {
    conn.close()
      .then(() => done())
      .catch((err) => done(err))
  })
})