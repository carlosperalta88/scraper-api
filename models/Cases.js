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
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }, toJSON: { virtuals: true }})

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

CasesSchema.statics.add = function (items) {
  return this.insertMany(items)
}

const Cases = mongoose.model('Cases', CasesSchema)
export default Cases