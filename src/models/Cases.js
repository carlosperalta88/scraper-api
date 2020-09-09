import mongoose from 'mongoose'
import CourtSchema from '../models/Courts'
import basicMethods from '../lib/basic-model-methods'

const Schema = mongoose.Schema

const CasesSchema = new Schema({
  'court': {type: CourtSchema.schema, required: true, unique: false},
  'role': {type: String, required: true, unique: false},
  'external_id': String,
  'users': [{type: mongoose.Schema.ObjectId, ref: 'Users'}],
  'clients': [{type: mongoose.Schema.ObjectId, ref: 'Clients'}],
  'is_active': Boolean,
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

CasesSchema.set('toObject', {virtuals: true})
CasesSchema.set('toJSON', {virtuals: true})

CasesSchema.index({
  role: 1,
})

CasesSchema.virtual('cases', {
  ref: 'CasesData',
  localField: '_id',
  foreignField: 'case_id',
  options: {sort: {created_at: -1}, limit: 1},
})

CasesSchema.plugin(basicMethods)

CasesSchema.statics.deleteManyByExternalId = function(externalIds) {
  return this.updateMany({external_id: {$in: externalIds}},
      {$set: {is_active: false}})
}

CasesSchema.statics.updateUsers = function(query, users) {
  return this.updateOne(query, {$push: {users: {$each: users}}})
}

CasesSchema.statics.updateClients = function(query, clients) {
  return this.updateOne(query, {$push: {clients: {$each: clients}}})
}

CasesSchema.statics.getCasesByClient = function(clients) {
  return this.find({clients: {$all: clients}}).populate('cases').exec()
}

CasesSchema.statics.getCasesByExternalId = function(externalId) {
  return this.find({externalId}).populate('cases').exec()
}

CasesSchema.statics.search = function(query) {
  return this.find(query)
      .populate('cases')
      .populate('clients')
      .populate('users')
      .exec()
}

CasesSchema.statics.getCaseUsers = function(query) {
  return this.find(query).populate('users')
}

CasesSchema.statics.getCaseId = function(query) {
  return this.find(query).select('_id')
}

CasesSchema.statics.bigSearch = function(query) {
  console.log(query)
  return this.find(query).cursor()
}

// Exclude Failed casesData from lookup
CasesSchema.statics.latestData = function(query) {
  return this.aggregate([
    {
      $match: query,
    },
    latestLookup,
    {$project: {
      users: 0,
      clients: 0,
      court: 0,
      is_active: 0,
    }},
  ])
}

const latestLookup = {
  $lookup: {
    from: 'casesdatas',
    let: {case_id: '$_id'},
    pipeline: [
      {$match: {
        $expr: {
          $and: [
            {$eq: ['$case_id', '$$case_id']},
            {$ne: ['$document_status', 'Failed']},
          ],
        },
      }},
      {$sort: {'created_at': -1}},
      {$limit: 2},
    ],
    as: 'cases',
  },
}

CasesSchema.statics.buildReport = function(q) {
  const qu = q.map((el) => {
    if (el.hasOwnProperty('clients')) {
      // eslint-disable-next-line new-cap
      return {clients: mongoose.Types.ObjectId(el['clients'])}
    }
    return el
  })
  const query = [{is_active: true}].concat(qu)
  return this.aggregate([
    {
      $match: {$and: query},
    },
    lookup,
    reportAggregation,
  ])
}

CasesSchema.statics.paginatedReport = function(req) {
  const {page = 1, limit = 20} = req.query
  const query = [{is_active: true}].concat(req.body.query)

  return this.aggregate([
    {$match: query},
    {$limit: limit * 1},
    {$skip: (page - 1) * limit},
    lookup,
    reportAggregation,
  ])
}

const lookup = {
  $lookup: {
    from: 'casesdatas',
    let: {case_id: '$_id'},
    pipeline: [
      {$match: {
        $expr: {
          $eq: ['$case_id', '$$case_id'],
        },
      }},
      {$sort: {'created_at': -1}},
      {$limit: 1},
    ],
    as: 'cases',
  },
}

const reportAggregation = {
  $project: {
    role: 1,
    court: '$court.name',
    document_status: '$cases.document_status',
    cover: '$cases.cover',
    external_id: 1,
    cover: 1,
    role_date: '$cases.date',
    scraper_executed: '$cases.created_at',
    last_reception: {
      $let: {
        vars: {
          splitted_dates: {$map: {
            input: {$arrayElemAt: ['$cases.receptor', 0]},
            as: 'ex',
            in: {$split: [
              {$arrayElemAt: [
                {$split: [
                  {$arrayElemAt: [
                    {$split: ['$$ex.retrieve_data', '.'],
                    }, 0],
                  }, ' -  ']}, 1]}, '/']},
          },
          },
        },
        in: {$map: {
          input: '$$splitted_dates',
          as: 'rd',
          in: {$dateFromString: {
            dateString: {$concat: [
              {$arrayElemAt: ['$$rd', 0]},
              '-', {$arrayElemAt: ['$$rd', 1]},
              '-', {$arrayElemAt: ['$$rd', 2]},
            ]},
            format: '%d-%m-%Y',
            onError: {$concat: [
              {$arrayElemAt: ['$$rd', 0]},
              '-', {$arrayElemAt: ['$$rd', 1]},
              '-', {$arrayElemAt: ['$$rd', 2]}]},
            onNull: '',
          },
          },
        },
        },
      },
    },
    book_1: {
      $let: {
        vars: {
          book: {$arrayElemAt:
            [{$arrayElemAt: ['$cases.cause_history', 0]}, 0]},
        },
        in: {
          $let: {
            vars: {
              splitted_dates: {$map: {
                input: '$$book.history',
                as: 'ex',
                in: {$split:
                  [{$arrayElemAt:
                    [{$split: ['$$ex.procedure_date', ' ']}, 0]}, '/']},
              },
              },
            },
            in: {$map: {
              input: '$$splitted_dates',
              as: 'rd',
              in: {$dateFromString: {
                dateString: {$concat:
                  [{$arrayElemAt:
                    ['$$rd', 0]}, '-', {$arrayElemAt: ['$$rd', 1]},
                  '-', {$arrayElemAt: ['$$rd', 2]}]},
                format: '%d-%m-%Y',
                onError: {$concat:
                  [{$arrayElemAt:
                    ['$$rd', 0],
                  },
                  '-', {$arrayElemAt: ['$$rd', 1]},
                  '-', {$arrayElemAt: ['$$rd', 2]}]},
                onNull: '',
              },
              },
            },
            },
          },
        },
      },
    },
    book_2: {
      $let: {
        vars: {
          book: {$arrayElemAt:
            [{$arrayElemAt: ['$cases.cause_history', 0]}, 1]},
        },
        in: {
          $let: {
            vars: {
              splitted_dates: {$map: {
                input: '$$book.history',
                as: 'ex',
                in: {$split:
                  [{$arrayElemAt:
                    [{$split: ['$$ex.procedure_date', ' ']}, 0]}, '/']},
              },
              },
            },
            in: {$map: {
              input: '$$splitted_dates',
              as: 'rd',
              in: {$dateFromString: {
                dateString: {$concat:
                  [{$arrayElemAt:
                    ['$$rd', 0]},
                  '-',
                  {$arrayElemAt:
                    ['$$rd', 1]}, '-', {$arrayElemAt: ['$$rd', 2]}]},
                format: '%d-%m-%Y',
                onError: {$concat:
                  [{$arrayElemAt: ['$$rd', 0]}, '-',
                    {$arrayElemAt: ['$$rd', 1]}, '-',
                    {$arrayElemAt: ['$$rd', 2]}]},
                onNull: '',
              },
              },
            },
            },
          },
        },
      },
    },
    book_3: {
      $let: {
        vars: {
          book: {$arrayElemAt:
            [{$arrayElemAt: ['$cases.cause_history', 0]}, 2]},
        },
        in: {
          $let: {
            vars: {
              splitted_dates: {$map: {
                input: '$$book.history',
                as: 'ex',
                in: {$split:
                  [{$arrayElemAt:
                    [{$split: ['$$ex.procedure_date', ' ']}, 0]}, '/']},
              },
              },
            },
            in: {$map: {
              input: '$$splitted_dates',
              as: 'rd',
              in: {$dateFromString: {
                dateString: {$concat:
                  [{$arrayElemAt: ['$$rd', 0]},
                    '-',
                    {$arrayElemAt: ['$$rd', 1]},
                    '-', {$arrayElemAt: ['$$rd', 2]}]},
                format: '%d-%m-%Y',
                onError: {$concat:
                  [{$arrayElemAt: ['$$rd', 0]},
                    '-', {$arrayElemAt: ['$$rd', 1]},
                    '-', {$arrayElemAt: ['$$rd', 2]}]},
                onNull: '',
              },
              },
            },
            },
          },
        },
      },
    },
    last_docs_book_1: {
      $let: {
        vars: {
          book: {$arrayElemAt: [{$arrayElemAt: ['$cases.pending_docs', 0]}, 0]},
        },
        in: {
          $let: {
            vars: {
              splitted_dates: {$map: {
                input: '$$book.docs',
                as: 'ex',
                in: {$split:
                  [{$arrayElemAt:
                    [{$split: ['$$ex.date_added', ' ']}, 0]}, '/']},
              },
              },
            },
            in: {$map: {
              input: '$$splitted_dates',
              as: 'rd',
              in: {$dateFromString: {
                dateString: {$concat:
                  [{$arrayElemAt: ['$$rd', 0]}, '-',
                    {$arrayElemAt: ['$$rd', 1]}, '-',
                    {$arrayElemAt: ['$$rd', 2]}]},
                format: '%d-%m-%Y',
                onError: {$concat:
                  [{$arrayElemAt: ['$$rd', 0]}, '-',
                    {$arrayElemAt: ['$$rd', 1]}, '-',
                    {$arrayElemAt: ['$$rd', 2]}]},
                onNull: '',
              },
              },
            },
            },
          },
        },
      },
    },
    last_docs_book_2: {
      $let: {
        vars: {
          book: {$arrayElemAt: [{$arrayElemAt: ['$cases.pending_docs', 0]}, 1]},
        },
        in: {
          $let: {
            vars: {
              splitted_dates: {$map: {
                input: '$$book.docs',
                as: 'ex',
                in: {$split:
                  [{$arrayElemAt:
                    [{$split: ['$$ex.date_added', ' ']}, 0]}, '/']},
              },
              },
            },
            in: {$map: {
              input: '$$splitted_dates',
              as: 'rd',
              in: {$dateFromString: {
                dateString: {$concat:
                  [{$arrayElemAt: ['$$rd', 0]}, '-',
                    {$arrayElemAt: ['$$rd', 1]}, '-',
                    {$arrayElemAt: ['$$rd', 2]}]},
                format: '%d-%m-%Y',
                onError: {$concat:
                  [{$arrayElemAt: ['$$rd', 0]}, '-',
                    {$arrayElemAt: ['$$rd', 1]}, '-',
                    {$arrayElemAt: ['$$rd', 2]}]},
                onNull: '',
              },
              },
            },
            },
          },
        },
      },
    },
    last_docs_book_3: {
      $let: {
        vars: {
          book: {$arrayElemAt: [{$arrayElemAt: ['$cases.pending_docs', 0]}, 2]},
        },
        in: {
          $let: {
            vars: {
              splitted_dates: {$map: {
                input: '$$book.docs',
                as: 'ex',
                in: {$split:
                  [{$arrayElemAt:
                    [{$split: ['$$ex.date_added', ' ']}, 0]}, '/']},
              },
              },
            },
            in: {$map: {
              input: '$$splitted_dates',
              as: 'rd',
              in: {$dateFromString: {
                dateString: {$concat:
                  [{$arrayElemAt: ['$$rd', 0]}, '-',
                    {$arrayElemAt: ['$$rd', 1]}, '-',
                    {$arrayElemAt: ['$$rd', 2]}]},
                format: '%d-%m-%Y',
                onError: {$concat:
                  [{$arrayElemAt: ['$$rd', 0]}, '-',
                    {$arrayElemAt: ['$$rd', 1]}, '-',
                    {$arrayElemAt: ['$$rd', 2]}]},
                onNull: '',
              },
              },
            },
            },
          },
        },
      },
    },
    exhorts_added_date: {
      $let: {
        vars: {
          splitted_dates: {$map: {
            input: {$arrayElemAt: ['$cases.exhorts', 0]},
            as: 'ex',
            in: {$split: ['$$ex.exhort_added_date', '/']},
          },
          },
        },
        in: {$map: {
          input: '$$splitted_dates',
          as: 'rd',
          in: {$dateFromString: {
            dateString: {$concat:
              [{$arrayElemAt: ['$$rd', 0]}, '-',
                {$arrayElemAt: ['$$rd', 1]}, '-',
                {$arrayElemAt: ['$$rd', 2]}]},
            format: '%d-%m-%Y',
            onError: {$concat:
              [{$arrayElemAt: ['$$rd', 0]}, '-',
                {$arrayElemAt: ['$$rd', 1]}, '-',
                {$arrayElemAt: ['$$rd', 2]}]},
            onNull: '',
          },
          },
        },
        },
      },
    },
    exhorts_order_date: {
      $let: {
        vars: {
          splitted_dates: {$map: {
            input: {$arrayElemAt: ['$cases.exhorts', 0]},
            as: 'ex',
            in: {$split: ['$$ex.exhort_order_date', '/']},
          },
          },
        },
        in: {$map: {
          input: '$$splitted_dates',
          as: 'rd',
          in: {$dateFromString: {
            dateString: {$concat:
              [{$arrayElemAt: ['$$rd', 0]}, '-',
                {$arrayElemAt: ['$$rd', 1]}, '-', {$arrayElemAt: ['$$rd', 2]}]},
            format: '%d-%m-%Y',
            onError: {$concat:
              [{$arrayElemAt: ['$$rd', 0]}, '-',
                {$arrayElemAt: ['$$rd', 1]}, '-', {$arrayElemAt: ['$$rd', 2]}]},
            onNull: '',
          },
          },
        },
        },
      },
    },
    exhorts_details_date: {
      $let: {
        vars: {
          splitted_details: {$map: {
            input: {$arrayElemAt: ['$cases.exhorts', 0]},
            as: 'ex',
            in: '$$ex.role_destination_detail',
          },
          },
        },
        in: {$map: {
          input: {$map: {
            input: {$reduce: {
              input: '$$splitted_details',
              initialValue: [],
              in: {$concatArrays: ['$$value', '$$this']},
            },
            },
            as: 'ex',
            in: {$split: ['$$ex.date', '/']},
          },
          },
          as: 'rd',
          in: {$dateFromString: {
            dateString: {$concat:
              [{$arrayElemAt: ['$$rd', 0]}, '-',
                {$arrayElemAt: ['$$rd', 1]}, '-', {$arrayElemAt: ['$$rd', 2]}]},
            format: '%d-%m-%Y',
            onError: {$concat:
              [{$arrayElemAt: ['$$rd', 0]}, '-',
                {$arrayElemAt: ['$$rd', 1]}, '-', {$arrayElemAt: ['$$rd', 2]}]},
            onNull: '',
          },
          },
        },
        },
      },
    },
  },
}

const Cases = mongoose.model('Cases', CasesSchema)
export default Cases
