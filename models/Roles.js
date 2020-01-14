var mongoose = require('mongoose')
var Schema = mongoose.Schema

var RolesSchema = new Schema({
  name: { type: String, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

module.exports = mongoose.model('Roles', RolesSchema)