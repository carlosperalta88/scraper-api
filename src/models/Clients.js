import mongoose from 'mongoose'
const Schema = mongoose.Schema
import basicMethods from '../lib/basic-model-methods'

const ClientsSchema = new Schema({
  name: {type: String, required: true},
  external_id: {type: String, required: true},
  is_active: Boolean,
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

ClientsSchema.plugin(basicMethods)

ClientsSchema.statics.get = function(externalId) {
  return this.find({externalId})
}

ClientsSchema.statics.getClientsId = function(body) {
  return this.find(body).select('_id')
}

ClientsSchema.statics.delete = function(externalId) {
  return this.updateOne({external_id: externalId}, {$set: {is_active: false}})
}

const Clients = mongoose.model('Clients', ClientsSchema)

export default Clients
