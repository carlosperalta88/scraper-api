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

const Cases = mongoose.model('Cases', CasesSchema)
export default Cases