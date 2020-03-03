var mongoose = require('mongoose')
var CourtSchema = require('../models/Courts')
var UsersSchema = require('../models/Users')
var ClientSchema = require('../models/Clients')
var CasesData = require('../models/CasesData')
var Schema = mongoose.Schema

var CasesSchema = new Schema({
  "court": { type: CourtSchema.schema, required: true, unique: false },
  "role": { type: String, required: true, unique: false },
  "external_id": String,
  "users": [{ type: mongoose.Schema.ObjectId, ref: 'Users' }],
  "clients": [{ type: mongoose.Schema.ObjectId, ref: 'Clients' }],
  "is_active": Boolean
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

CasesSchema.index({
  role: 'text'
})

CasesSchema.static.deleteOne = async (role, court) => {
  return await Cases.updateOne({ $and: [{ role: role }, { 'court.external_id': court }] }, { is_active: false })
}

CasesSchema.static.deleteMany = async (roles = []) => {
  return await Cases.updateMany({ external_id: { $in: roles } }, { $set: { is_active: false } })
}

CasesSchema.static.update = async (query, edit) => {
  return await Cases.updateOne(query, { $set: edit })
}

CasesSchema.static.updateCaseData = async (query, data) => {
  return await Cases.updateOne(query, { $push: data })
}

CasesSchema.static.insertMany = async (items) => {
  return await Cases.insertMany(items)
}

CasesSchema.static.caseCreator = async (body) => {
  let court
  let users
  let clients

  try {
    court = await CourtSchema.find({ external_id: body.court_id })
    users = [ await UsersSchema.search({ email: { $in: body.emails } })[0]._id ]
    clients = [ await ClientSchema.search({ external_id: { $in: body.clients } })[0]._id ]
  } catch (error) {
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

CasesSchema.virtual('case', {
  ref: 'CasesData',
  localField: '_id',
  foreignField: 'case_id',
  options: { sort: { created_at: -1 }, limit: 1 }
})

CasesSchema.static.getCasesByClient = async (clients) => {
  return await Cases.find({ clients: { $all: clients } }).populate('case').exec()
}

CasesSchema.static.getCasesByExternalId = async (external_id) => {
  return await Cases.find({ external_id }).populate('case').exec()
}

CasesSchema.static.search = async (query) => {
  return await Cases.find(query).populate('case').exec()
}

const Cases = mongoose.model('Cases', CasesSchema)
export default Cases