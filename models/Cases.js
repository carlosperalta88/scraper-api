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

CasesSchema.index({
  role: 'text'
})

CasesSchema.statics.deleteOne = function (role, court) {
  return this.updateOne({ $and: [{ role: role }, { 'court.external_id': court }] }, { is_active: false })
}

CasesSchema.statics.deleteManyByExternalId = function(roles) {
  return this.updateMany({ external_id: { $in: roles } }, { $set: { is_active: false } })
}

CasesSchema.statics.update = function (query, edit) {
  return this.updateOne(query, { $set: edit })
}

CasesSchema.statics.updateCaseData = function (query, data) {
  return this.updateOne(query, { $push: data })
}

CasesSchema.statics.insertMany = function (items) {
  return this.insertMany(items)
}

CasesSchema.statics.caseCreator = function (body) {
  let court
  let users
  let clients

  try {
    court = CourtSchema.find({ external_id: body.court_id })
    users = [ UsersSchema.search({ email: { $in: body.emails } })[0]._id ]
    clients = [ ClientSchema.search({ external_id: { $in: body.clients } })[0]._id ]
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

CasesSchema.statics.getCasesByClient = function (clients) {
  return this.find({ clients: { $all: clients } }).populate('case').exec()
}

CasesSchema.statics.getCasesByExternalId = function (external_id) {
  return this.find({ external_id }).populate('case').exec()
}

CasesSchema.statics.search = function (query) {
  return this.find(query).populate('case').exec()
}

export default mongoose.model('Cases', CasesSchema)