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


UsersSchema.statics.get = async (email) => {
  return await Users.find({ email })
}

UsersSchema.statics.add = async (body) => {
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
  const user = new this.users(newUser)
  await user.save()
  return user
}

UsersSchema.statics.search = async (body) => {
  return await Users.find(body)
}

UsersSchema.statics.delete = async (email) => {
  return await Users.updateOne({ email: email }, { $set: { is_active: false } })
}

UsersSchema.statics.update = async (email, body) => {
  return await Users.updateOne({ email }, { $set: body })
}


const Users = mongoose.model('Users', UsersSchema)

export default Users