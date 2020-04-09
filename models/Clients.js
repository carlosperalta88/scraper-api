import mongoose from 'mongoose'
let Schema = mongoose.Schema

let ClientsSchema = new Schema({
  name: { type: String, required: true },
  external_id: { type: String, required: true },
  is_active: Boolean
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

ClientsSchema.statics.get = function(external_id) {
  return this.find({ external_id })
}

ClientsSchema.statics.add = async function(body) {
  return await new Clients(body).save()
}

ClientsSchema.statics.search = function(body) {
  return this.find(body)
}

ClientsSchema.statics.getClientsId = function(body) {
  return this.find(body).select('_id')
}

ClientsSchema.statics.delete = function(external_id) {
  return this.updateOne({ external_id: external_id }, { $set: { is_active: false } })
}

ClientsSchema.statics.update = function(external_id, body) {
  return this.updateOne({ external_id }, { $set: body })
}

const Clients = mongoose.model('Clients', ClientsSchema)

export default Clients