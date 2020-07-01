import mongoose from 'mongoose'
const Schema = mongoose.Schema
import basicMethods from '../lib/basic-model-methods'

const CasesDataSchema = new Schema({
  'case_id': {type: mongoose.Schema.ObjectId, required: true},
  'cover': {type: String},
  'date': Date,
  'document_status': String,
  'receptor': [],
  'pending_docs': [],
  'cause_history': [],
  'exhorts': [],
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

CasesDataSchema.index({
  case_id: 1,
})

CasesDataSchema.plugin(basicMethods)

CasesDataSchema.statics.getLatest = function(query) {
  return this.find(query).sort({created_at: -1}).limit(1)
}

const CasesData = mongoose.model('CasesData', CasesDataSchema)
export default CasesData
