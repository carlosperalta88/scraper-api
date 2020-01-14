var mongoose = require('mongoose')
var Schema = mongoose.Schema

var ClientsSchema = new Schema({
  name: { type: String, required: true },
  external_id: { type: String, required: true },
  is_active: Boolean
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

module.exports = mongoose.model('Clients', ClientsSchema)