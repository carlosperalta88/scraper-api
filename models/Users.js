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

module.exports = mongoose.model('Users', UsersSchema)