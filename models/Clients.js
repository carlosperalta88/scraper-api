import mongoose from 'mongoose'
let Schema = mongoose.Schema

let ClientsSchema = new Schema({
  name: { type: String, required: true },
  external_id: { type: String, required: true },
  is_active: Boolean
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

ClientsSchema.statics.get = function(external_id) {
  return await this.find({ external_id })
}

ClientsSchema.statics.add = function(body) {
  return await new Clients(body).save()
}

ClientsSchema.statics.search = function(body) {
  return await this.find(body)
}

ClientsSchema.statics.delete = function(external_id) {
  return await this.updateOne({ external_id: external_id }, { $set: { is_active: false } })
}

ClientsSchema.statics.update = function(external_id, body) {
  return await this.updateOne({ external_id }, { $set: body })
}

const Clients = mongoose.model('Clients', ClientsSchema)

export default Clients