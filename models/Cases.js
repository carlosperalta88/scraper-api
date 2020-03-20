import mongoose from 'mongoose'
import CourtSchema from '../models/Courts'
import UsersSchema from '../models/Users'
import ClientSchema from '../models/Clients'
import CasesData from '../models/CasesData'

let Schema = mongoose.Schema

var CasesSchema = new Schema({
  "court": { type: CourtSchema.schema, required: true, unique: false },
  "role": { type: String, required: true, unique: false },
  "external_id": String,
  "users": [{ type: mongoose.Schema.ObjectId, ref: 'Users' }],
  "clients": [{ type: mongoose.Schema.ObjectId, ref: 'Clients' }],
  "is_active": Boolean
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

CasesSchema.set('toObject', { virtuals: true })
CasesSchema.set('toJSON', { virtuals: true })

CasesSchema.index({
  role: 'text'
})

CasesSchema.virtual('cases', {
  ref: 'CasesData',
  localField: '_id',
  foreignField: 'case_id',
  options: { sort: { date: -1 }, limit: 1 }
})

CasesSchema.statics.deleteManyByExternalId = function(external_ids) {
  return this.updateMany({ external_id: { $in: external_ids } }, { $set: { is_active: false } })
}

CasesSchema.statics.update = function (query, edit) {
  return this.updateOne(query, { $set: edit })
}

CasesSchema.statics.updateUsers = function (query, users) {
  return this.updateOne(query, { $push: { users: { $each: users } } })
}

CasesSchema.statics.updateClients = function (query, clients) {
  return this.updateOne(query, { $push: { clients: { $each: clients } } })
}


CasesSchema.statics.getCasesByClient = function (clients) {
  return this.find({ clients: { $all: clients } }).populate('cases').exec()
}

CasesSchema.statics.getCasesByExternalId = function (external_id) {
  return this.find({ external_id }).populate('cases').exec()
}

CasesSchema.statics.search = function (query) {
  return this.find(query).populate('cases').populate('clients').populate('users').exec()
}

CasesSchema.statics.getCaseId = function (query) {
  return this.find(query).select('_id')
}

CasesSchema.statics.add = function (items) {
  return this.insertMany(items)
}

CasesSchema.statics.buildReport = function(client) {
  return this.aggregate([
    {
      $match: { $and: [{ 'clients.external_id': client }, { is_active: true }] }
    },
    {
      $lookup: {
        from: 'CasesData',
        localField: '_id',
        foreignField: 'case_id',
        as: 'case'
      }
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

const Cases = mongoose.model('Cases', CasesSchema)
export default Cases