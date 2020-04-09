import mongoose from 'mongoose'
let Schema = mongoose.Schema
import Clients from '../models/Clients'
import Roles from '../models/Roles'

let UsersSchema = new Schema({
  "email": { type: String, required: true },
  "client": { type: Clients.schema, required: true, unique: false },
  "role": { type: Roles.schema, required: true, unique: false},
  "external_id": String,
  "is_active": Boolean
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

UsersSchema.index({
  email: 'text'
})

UsersSchema.statics.get = function(email) {
  return this.find({ email })
}

UsersSchema.statics.add = function(body) {
  return this.create(body)
}

UsersSchema.statics.search = function(query) {
  return this.find(query)
}

UsersSchema.statics.getId = function(query) {
  return this.find(query).select('_id')
}

UsersSchema.statics.getEmailById = function(query) {
  return this.find(query).select('email')
}

UsersSchema.statics.delete = function(email) {
  return this.updateOne({ email: email }, { $set: { is_active: false } })
}

UsersSchema.statics.update = function(email, body) {
  return this.updateOne({ email }, { $set: body })
}

const Users = mongoose.model('Users', UsersSchema)
export default Users