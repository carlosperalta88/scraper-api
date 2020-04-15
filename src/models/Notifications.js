var mongoose = require('mongoose')
var Schema = mongoose.Schema

var NotificationsSchema = new Schema({
  "case_id": { type: mongoose.Schema.ObjectId, required: true },
  "variations": [String],
  "emails": [String],
  "status": String,
  "failed_emails": [String]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

NotificationsSchema.statics.add = function (payload) {
  return this.inserMany(payload)
}

NotificationsSchema.statics.get = function (query) {
  return this.find(query)
}

module.exports = mongoose.model('Notifications', NotificationsSchema)