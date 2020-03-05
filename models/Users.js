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
  return await this.find({ email })
}

UsersSchema.statics.add = function(body) {
  let role
  let client
  try {
    role = await Roles.get(body['role'])
    client = await Clients.get(body['client'])
  } catch (error) {
    this.logger.info(error)
    throw new Error(error)
  }
  let newUser = JSON.parse(JSON.stringify(body))
  newUser['role'] = role[0]
  newUser['client'] = client[0]
  return await new Users(newUser).save()
}

UsersSchema.statics.search = function(query) {
  return await this.find(query)
}

UsersSchema.statics.delete = function(email) {
  return await this.updateOne({ email: email }, { $set: { is_active: false } })
}

UsersSchema.statics.update = function(email, body) {
  return await this.updateOne({ email }, { $set: body })
}

const Users = mongoose.model('Users', UsersSchema)
export default Users