import mongoose from 'mongoose'
let Schema = mongoose.Schema
import Clients from '../models/Clients'
import Cases from '../models/Cases'

let ReportsSchema = new Schema({
  client: { type: mongoose.Schema.ObjectId, ref: 'Clients' },
  data: []
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

ReportsSchema.statics.get = function(query) {
  return this.find(query).populate('client')
}

const Reports = mongoose.model('Reports', ReportsSchema)
export default Reports