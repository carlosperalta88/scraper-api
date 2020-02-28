const Cases = require('../models/Cases')
const Courts = require('../models/Courts')
const Notifications = require('../services/notifications')
const Clients = require('../services/clients')
const Users = require('../services/users')
const logger = require('../config/winston')

class CaseService {
  constructor() {
    this.cases = Cases
    this.courts = Courts
    this.clients = Clients
    this.users = Users
    this.logger = logger
    this.notifications = Notifications
    this.reportAggregation = { 
      $project: {
      role: 1,
      court: '$court.name',
      document_status: 1,
      external_id: 1,
      cover: 1,
      date: 1,
      last_reception: {
        $let: {
          vars: {
            splitted_dates: { $map: {
              input: '$receptor',
              as: 'ex',
              in: { $split: [{ $arrayElemAt: [{ $split: [{ $arrayElemAt: [{ $split: ['$$ex.retrieve_data', '.' ]}, 0]}, ' -  ']}, 1]}, '/']}
              }
            }
          },
          in: { $map: {
              input: '$$splitted_dates',
              as: 'rd',
              in: { $dateFromString: {
                  dateString: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                  format: '%d-%m-%Y',
                  onError: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                  onNull: ''
                } 
              }
            }
          }
        } 
      },
      book_1: {
        $let: {
          vars: {
            book: { $arrayElemAt: [ '$cause_history', 0 ]},
          },
          in: {
            $let: {
              vars: {
                splitted_dates: { $map: {
                    input: '$$book.history',
                    as: 'ex',
                    in: { $split: [{ $arrayElemAt: [{ $split: ['$$ex.procedure_date', ' ' ]}, 0]}, '/'] }
                  }
                }
              },
              in: { $map: {
                  input: '$$splitted_dates',
                  as: 'rd',
                  in: { $dateFromString: {
                      dateString: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                      format: '%d-%m-%Y',
                      onError: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                      onNull: ''
                    } 
                  }
                }
              } 
            }
          }
        }
      }, 
      book_2: {
        $let: {
          vars: {
            book: { $arrayElemAt: [ '$cause_history', 1 ]},
          },
          in: {
            $let: {
              vars: {
                splitted_dates: { $map: {
                    input: '$$book.history',
                    as: 'ex',
                    in: { $split: [{ $arrayElemAt: [{ $split: ['$$ex.procedure_date', ' ' ]}, 0]}, '/'] }
                  }
                }
              },
              in: { $map: {
                  input: '$$splitted_dates',
                  as: 'rd',
                  in: { $dateFromString: {
                      dateString: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                      format: '%d-%m-%Y',
                      onError: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                      onNull: ''
                    } 
                  }
                }
              } 
            }
          }
        }
      },
      book_3: {
        $let: {
          vars: {
            book: { $arrayElemAt: [ '$cause_history', 2 ]},
          },
          in: {
            $let: {
              vars: {
                splitted_dates: { $map: {
                    input: '$$book.history',
                    as: 'ex',
                    in: { $split: [{ $arrayElemAt: [{ $split: ['$$ex.procedure_date', ' ' ]}, 0]}, '/'] }
                  }
                }
              },
              in: { $map: {
                  input: '$$splitted_dates',
                  as: 'rd',
                  in: { $dateFromString: {
                      dateString: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                      format: '%d-%m-%Y',
                      onError: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                      onNull: ''
                    } 
                  }
                }
              } 
            }
          }
        }
      },
      last_docs_book_1: {
        $let: {
          vars: {
            book: { $arrayElemAt: [ '$pending_docs', 0 ]},
          },
          in: {
            $let: {
              vars: {
                splitted_dates: { $map: {
                    input: '$$book.docs',
                    as: 'ex',
                    in: { $split: [{ $arrayElemAt: [{ $split: ['$$ex.date_added', ' ' ]}, 0]}, '/'] }
                  }
                }
              },
              in: { $map: {
                  input: '$$splitted_dates',
                  as: 'rd',
                  in: { $dateFromString: {
                      dateString: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                      format: '%d-%m-%Y',
                      onError: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                      onNull: ''
                    } 
                  }
                }
              } 
            }
          }
        }
      },
      last_docs_book_2: {
        $let: {
          vars: {
            book: { $arrayElemAt: [ '$pending_docs', 1 ]},
          },
          in: {
            $let: {
              vars: {
                splitted_dates: { $map: {
                    input: '$$book.docs',
                    as: 'ex',
                    in: { $split: [{ $arrayElemAt: [{ $split: ['$$ex.date_added', ' ' ]}, 0]}, '/'] }
                  }
                }
              },
              in: { $map: {
                  input: '$$splitted_dates',
                  as: 'rd',
                  in: { $dateFromString: {
                      dateString: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                      format: '%d-%m-%Y',
                      onError: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                      onNull: ''
                    } 
                  }
                }
              } 
            }
          }
        }
      },
      last_docs_book_3: {
        $let: {
          vars: {
            book: { $arrayElemAt: [ '$pending_docs', 2 ]},
          },
          in: {
            $let: {
              vars: {
                splitted_dates: { $map: {
                    input: '$$book.docs',
                    as: 'ex',
                    in: { $split: [{ $arrayElemAt: [{ $split: ['$$ex.date_added', ' ' ]}, 0]}, '/'] }
                  }
                }
              },
              in: { $map: {
                  input: '$$splitted_dates',
                  as: 'rd',
                  in: { $dateFromString: {
                      dateString: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                      format: '%d-%m-%Y',
                      onError: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                      onNull: ''
                    } 
                  }
                }
              } 
            }
          }
        }
      },
      exhorts_added_date: {
        $let: {
          vars: {
            splitted_dates: { $map: {
                input: '$exhorts',
                as: 'ex',
                in: { $split: ['$$ex.exhort_added_date', '/'] }
              }
            }
          },
          in: { $map: {
              input: '$$splitted_dates',
              as: 'rd',
              in: { $dateFromString: {
                  dateString: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                  format: '%d-%m-%Y',
                  onError: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                  onNull: ''
                } 
              }
            }
          } 
        }
      },
      exhorts_order_date: {
        $let: {
          vars: {
            splitted_dates: { $map: {
                input: '$exhorts',
                as: 'ex',
                in: { $split: ['$$ex.exhort_order_date', '/'] }
              }
            }
          },
          in: { $map: {
              input: '$$splitted_dates',
              as: 'rd',
              in: { $dateFromString: {
                  dateString: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                  format: '%d-%m-%Y',
                  onError: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                  onNull: ''
                } 
              }
            }
          } 
        }
      },
      exhorts_details_date: {
        $let: {
          vars: {
            splitted_details: { $map: {
                input: '$exhorts',
                as: 'ex',
                in: '$$ex.role_destination_detail'
              }
            }
          },
          in: { $map: {
              input: { $map: {
                  input: { $reduce: {
                      input: '$$splitted_details',
                      initialValue: [],
                      in: { $concatArrays: ['$$value', '$$this']}
                    } 
                  },
                  as: 'ex',
                  in: { $split: ['$$ex.date', '/'] }
                } 
              },
              as: 'rd',
              in: { $dateFromString: {
                  dateString: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                  format: '%d-%m-%Y',
                  onError: { $concat: [{ $arrayElemAt: [ '$$rd', 0] }, '-', { $arrayElemAt: [ '$$rd', 1] }, '-', { $arrayElemAt: [ '$$rd', 2] }] },
                  onNull: ''
                } 
              }
            }
          } 
        }
      }
    }
    }
  }

  sortDates(dateA, dateB) {
    if (dateA > dateB) return 1
    if (dateA < dateB) return -1
    return 0
  }

  applySort(listOfCases) {
    return listOfCases.map((rep) => {
      rep['exhorts_order_date'] = (!rep['exhorts_order_date'] ? [] : rep['exhorts_order_date'].sort(this.sortDates).slice(-1))
      rep['exhorts_added_date'] = (!rep['exhorts_added_date'] ? [] : rep['exhorts_added_date'].sort(this.sortDates).slice(-1))
      rep['exhorts_details_date'] = (!rep['exhorts_details_date'] ? [] : rep['exhorts_details_date'].sort(this.sortDates).slice(-1))
      rep['last_reception'] = (!rep['last_reception'] ? [] : rep['last_reception'].sort(this.sortDates).slice(-1))
      rep['book_1'] = (!rep['book_1'] ? [] : rep['book_1'].sort(this.sortDates).slice(-1))
      rep['book_2'] = (!rep['book_2'] ? [] : rep['book_2'].sort(this.sortDates).slice(-1))
      rep['book_3'] = (!rep['book_3'] ? [] : rep['book_3'].sort(this.sortDates).slice(-1))
      rep['last_docs_book_1'] = (!rep['last_docs_book_1'] ? [] : rep['last_docs_book_1'].sort(this.sortDates).slice(-1))
      rep['last_docs_book_2'] = (!rep['last_docs_book_2'] ? [] : rep['last_docs_book_2'].sort(this.sortDates).slice(-1))
      rep['last_docs_book_3'] = (!rep['last_docs_book_3'] ? [] : rep['last_docs_book_3'].sort(this.sortDates).slice(-1))
      return rep
    })
  }

  async requestCase(role) {
    const rawReport = await this.cases.aggregate([
      {
        $match: { role: role }
      },
      this.reportAggregation
    ])

    let sorted = rawReport.map((rep) => {
      rep['exhorts_order_date'] = (!rep['exhorts_order_date'] ? [] : rep['exhorts_order_date'].sort(this.sortDates).slice(-1))
      rep['exhorts_added_date'] = (!rep['exhorts_added_date'] ? [] : rep['exhorts_added_date'].sort(this.sortDates).slice(-1))
      rep['exhorts_details_date'] = (!rep['exhorts_details_date'] ? [] : rep['exhorts_details_date'].sort(this.sortDates).slice(-1))
      rep['last_reception'] = (!rep['last_reception'] ? [] : rep['last_reception'].sort(this.sortDates).slice(-1))
      rep['book_1'] = (!rep['book_1'] ? [] : rep['book_1'].sort(this.sortDates).slice(-1))
      rep['book_2'] = (!rep['book_2'] ? [] : rep['book_2'].sort(this.sortDates).slice(-1))
      rep['book_3'] = (!rep['book_3'] ? [] : rep['book_3'].sort(this.sortDates).slice(-1))
      rep['last_docs_book_1'] = (!rep['last_docs_book_1'] ? [] : rep['last_docs_book_1'].sort(this.sortDates).slice(-1))
      rep['last_docs_book_2'] = (!rep['last_docs_book_2'] ? [] : rep['last_docs_book_2'].sort(this.sortDates).slice(-1))
      rep['last_docs_book_3'] = (!rep['last_docs_book_3'] ? [] : rep['last_docs_book_3'].sort(this.sortDates).slice(-1))
      return rep
    })

    return sorted
  }

  async deleteOne(role, court) {
    return await this.cases.updateOne({ $and: [{ role: role }, { 'court.external_id': court }] }, { is_active: false })
  }

  async update(query, edit) {
    return await this.cases.updateOne(query, { $set: edit })
  }

  async insertMany(items) {
    return await this.cases.insertMany(items)
  }

  async aggregateByClient(client) {
    const roles = await this.cases.aggregate([
      {
        $match: { 'clients.external_id': client }
      },
      this.reportAggregation
    ])
    return this.applySort(roles)
  }

  async getAllActiveRoles() {
    const allRoles = await this.cases.aggregate([
      {
        $match: { is_active: true }
      },
      this.reportAggregation
    ])
    return this.applySort(allRoles)
  }

  async search(query) {
    return await this.cases.find(query)
  }
  
  formatScraperResponse(scraperResponse) {
    try {
      const modelKeys = ['court','cover','role','document_status','receptor','pending_docs','cause_history','exhorts']
      const newObject = new Object()
      const objectBuilder = modelKeys.map((el, elIndex) => {
        if(elIndex < 3) {
          newObject[el] = scraperResponse['role_search'][0][el].trim()
          return
        }
  
        if(elIndex === 3) {
          newObject[el] = scraperResponse['status']
          return
        }
  
        newObject[el] = scraperResponse[el]
      })
      return newObject
    } catch (error) {
      this.logger.info(error)
    }
  }
  
  compareCases(storedVersion, scraperResponseFormatted) {
    let diff = []
    const comparisson = Object.keys(scraperResponseFormatted).map((el) => {
      if(!storedVersion.hasOwnProperty(el)) return false
  
      if(typeof scraperResponseFormatted[el] == 'object') {
        let assert = (scraperResponseFormatted[el].length === storedVersion[el].length)
        if (assert) diff.append(el)
        return assert
      }
      if(el === 'document_status') {
        return (scraperResponseFormatted[el].trim() === storedVersion[el].trim())
      }
      if(el === 'court') {
        return (scraperResponseFormatted[el] === storedVersion[el]['name'])
      }
    }).reduce((acc, cv) => acc === cv)
    return { hasChanged: comparisson, diff }
  }
  
  async caseCreator(body) {
    let court
    let users
    let clients
    try {
      court = await this.courts.find({ external_id: body.court_id })
      users = await this.users.search({ email: { $in: body.emails } })
      clients = await this.clients.search({ external_id: { $in: body.clients } })
    } catch (error) {
      this.logger.info(error, body)
      throw new Error(error)
    }
    return new Cases({
      role: body.role,
      court: court[0],
      external_id: body.external_id,
      clients: clients,
      users: users,
      is_active: true
    })
  }

  buildPayload(storedVersion, req) {
    storedVersion['cover'] = req.body['role_search'][0]['cover']
    let role_date = req.body['role_search'][0]['date'].split('/')
    storedVersion['date'] = new Date(role_date[2], role_date[1]-1, role_date[0]).toISOString().split('T')[0]
    storedVersion['document_status'] = req.body['status']
    storedVersion['receptor'] = req.body['receptor']
    storedVersion['pending_docs'] = req.body['pending_docs']
    storedVersion['cause_history'] = req.body['cause_history']
    storedVersion['exhorts'] = req.body['exhorts']
    storedVersion['is_active'] = true
    return storedVersion
  }
}

module.exports = new CaseService()