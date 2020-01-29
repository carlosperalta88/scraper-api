var mongoose = require('mongoose')
var CourtSchema = require('../models/Courts')
var UsersSchema = require('../models/Users')
var ClientSchema = require('../models/Clients')
var Schema = mongoose.Schema

var CasesSchema = new Schema({
  "court": { type: CourtSchema.schema, required: true, unique: false },
  "cover": { type: String },
  "date": Date,
  "role": { type: String, required: true, unique: false },
  "external_id": String,
  "document_status": String,
  "receptor": [],
  "pending_docs": [],
  "cause_history": [],
  "exhorts": [],
  "users": [{ type: UsersSchema.schema }],
  "clients": [{ type: ClientSchema.schema }],
  "is_active": Boolean
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

CasesSchema.index({
  role: 'text'
})

module.exports = mongoose.model('Cases', CasesSchema)