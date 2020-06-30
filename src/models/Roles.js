import mongoose from 'mongoose'
const Schema = mongoose.Schema
import basicMethods from '../lib/basic-model-methods'

const RolesSchema = new Schema({
  name: {type: String, required: true},
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

RolesSchema.plugin(basicMethods)

const Roles = mongoose.model('Roles', RolesSchema)
export default Roles
