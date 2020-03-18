import mongoose from 'mongoose'
let Schema = mongoose.Schema
import Clients from '../models/Clients'
import Cases from '../models/Cases'

let ReportsSchema = new Schema({
  client: { type: mongoose.Schema.ObjectId, ref: 'Clients' },
  data: []
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

ReportsSchema.statics.get = function(query) {
  return this.find(query).populate('client')
}

ReportsSchema.statics.create = function(client, data) {
  return this.create({ client, data })
}

ReportsSchema.statics.build = function(client) {
  return this.aggregate([
    {
      $match: { $and: [{ 'clients.external_id': client }, { is_active: true }] }
    },
    reportAggregation
  ])
}

let reportAggregation = { 
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
          input: '$case.0.receptor',
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
        book: { $arrayElemAt: [ '$case.0.cause_history', 0 ]},
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
        book: { $arrayElemAt: [ '$case.0.cause_history', 1 ]},
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
        book: { $arrayElemAt: [ '$case.0.cause_history', 2 ]},
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
        book: { $arrayElemAt: [ '$case.0.pending_docs', 0 ]},
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
        book: { $arrayElemAt: [ '$case.0.pending_docs', 1 ]},
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
        book: { $arrayElemAt: [ '$case.0.pending_docs', 2 ]},
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
            input: '$case.0.exhorts',
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
            input: '$case.0.exhorts',
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
            input: '$case.0.exhorts',
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

const Reports = mongoose.model('Reports', ReportsSchema)
export default Reports