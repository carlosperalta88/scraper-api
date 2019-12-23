var mongoose = require('mongoose')
var Schema = mongoose.Schema

var CourtsSchema = new Schema({
  name: { type: String, required: true },
  external_id: Number
})

module.exports = mongoose.model('Courts', CourtsSchema)