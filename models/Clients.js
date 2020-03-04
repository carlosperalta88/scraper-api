import mongoose from 'mongoose'
let Schema = mongoose.Schema

let ClientsSchema = new Schema({
  name: { type: String, required: true },
  external_id: { type: String, required: true },
  is_active: Boolean
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

ClientsSchema.statics.get = async (external_id) => {
  return await Clients.find({ external_id })
}

ClientsSchema.statics.add = async (body) => {
  return await new Clients(body).save()
}

ClientsSchema.statics.search = async (body) => {
  return await Clients.find(body)
}

ClientsSchema.statics.delete = async (external_id) => {
  return await Clients.updateOne({ external_id: external_id }, { $set: { is_active: false } })
}

ClientsSchema.statics.update = async (external_id, body) => {
  return await Clients.updateOne({ external_id }, { $set: body })
}

const Clients = mongoose.model('Clients', ClientsSchema)

export default Clients