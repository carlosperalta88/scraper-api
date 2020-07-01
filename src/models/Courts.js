import mongoose from 'mongoose'
const Schema = mongoose.Schema
import basicMethods from '../lib/basic-model-methods'

const CourtsSchema = new Schema({
  name: {type: String, required: true},
  external_id: {type: Number, require: true, unique: false},
})

CourtsSchema.plugin(basicMethods)

const Courts = mongoose.model('Courts', CourtsSchema)
export default Courts
