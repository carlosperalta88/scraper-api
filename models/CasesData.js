import mongoose from 'mongoose'
let Schema = mongoose.Schema

let CasesDataSchema = new Schema({
  "case_id": { type: mongoose.Schema.ObjectId, required: true },
  "cover": { type: String },
  "date": Date,
  "document_status": String,
  "receptor": [],
  "pending_docs": [],
  "cause_history": [],
  "exhorts": [],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

CasesDataSchema.index({
  case_id: 1
})

CasesDataSchema.statics.add = function (payload) {
  return this.insertMany(payload)
}

const CasesData = mongoose.model('CasesData', CasesDataSchema)
export default CasesData