var mongoose = require('mongoose')
var CourtSchema = require('../models/Courts')
var Schema = mongoose.Schema

var CasesSchema = new Schema({
  "court": { type: CourtSchema.schema, required: true, unique: false },
  "cover": { type: String },
  "date": Date,
  "role": { type: String, required: true, unique: true },
  "document_status": String,
  "receptor": [],
  "pending_docs": [],
  "cause_history": [],
  "exhorts": [],
  "users": [Schema.Types.ObjectId],
  "is_active": Boolean
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

module.exports = mongoose.model('Cases', CasesSchema)