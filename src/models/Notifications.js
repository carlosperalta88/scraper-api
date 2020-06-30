const mongoose = require('mongoose')
const Schema = mongoose.Schema
import basicMethods from '../lib/basic-model-methods'

const NotificationsSchema = new Schema({
  'case_id': {type: mongoose.Schema.ObjectId, required: true},
  'variations': [String],
  'emails': [String],
  'status': String,
  'failed_emails': [String],
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

NotificationsSchema.plugin(basicMethods)

module.exports = mongoose.model('Notifications', NotificationsSchema)
