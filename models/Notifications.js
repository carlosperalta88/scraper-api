var mongoose = require('mongoose')
var Schema = mongoose.Schema

var NotificationsSchema = new Schema({
  role: String,
  variations: [String],
  emails: [String],
  status: String,
  failed_emails: [String]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

module.exports = mongoose.model('Notifications', NotificationsSchema)