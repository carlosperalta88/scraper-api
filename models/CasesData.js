import Cases from '../models/Cases'
import mongoose from 'mongoose'
let Schema = mongoose.Schema

let CasesDataSchema = new Schema({
  "case_id": { type: mongoose.Schema.ObjectId },
  "cover": { type: String },
  "date": Date,
  "document_status": String,
  "receptor": [],
  "pending_docs": [],
  "cause_history": [],
  "exhorts": [],
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

CasesDataSchema.statics.add = async (role, court, payload) => {
  let [parent_case] = await Cases.find({ $and: [{ role: role }, { 'court.name': court }] })
  payload['case_id'] = parent_case._id

  return await new CasesData(payload).save()
}

const CasesData = mongoose.model('CasesData', CasesDataSchema)

export default CasesData