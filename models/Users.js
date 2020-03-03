var mongoose = require('mongoose')
var Schema = mongoose.Schema
var Clients = require('../models/Clients')
var Roles = require('../models/Roles')

var UsersSchema = new Schema({
  email: { type: String, required: true },
  client: { type: Clients.schema, required: true, unique: false },
  role: { type: Roles.schema, required: true, unique: false},
  external_id: String,
  is_active: Boolean
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})


UsersSchema.static.get = async (email) => {
  return await Users.find({ email })
}

UsersSchema.static.add = async (body) => {
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

UsersSchema.static.search = async (body) => {
  return await Users.find(body)
}

UsersSchema.static.delete = async (email) => {
  return await Users.updateOne({ email: email }, { $set: { is_active: false } })
}

UsersSchema.static.update = async (email, body) => {
  return await Users.updateOne({ email }, { $set: body })
}


const Users = mongoose.model('Users', UsersSchema)

export default Users