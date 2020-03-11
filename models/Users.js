import mongoose from 'mongoose'
let Schema = mongoose.Schema
import Clients from '../models/Clients'
import Roles from '../models/Roles'

let UsersSchema = new Schema({
  email: { type: String, required: true },
  client: { type: Clients.schema, required: true, unique: false },
  role: { type: Roles.schema, required: true, unique: false},
  external_id: String,
  is_active: Boolean
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})


UsersSchema.statics.get = function(email) {
  return this.find({ email })
}

UsersSchema.statics.add = async function(body) {
  return await new Users(body).save()
}

UsersSchema.statics.search = function(query) {
  return this.find(query)
}

UsersSchema.statics.getIdByEmail = function(query) {
  return this.find(query)
}

UsersSchema.statics.delete = function(email) {
  return this.updateOne({ email: email }, { $set: { is_active: false } })
}

UsersSchema.statics.update = function(email, body) {
  return this.updateOne({ email }, { $set: body })
}

const Users = mongoose.model('Users', UsersSchema)
export default Users