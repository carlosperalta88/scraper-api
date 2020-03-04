import mongoose from 'mongoose'
let Schema = mongoose.Schema

let CourtsSchema = new Schema({
  name: { type: String, required: true },
  external_id: Number
})

export default mongoose.model('Courts', CourtsSchema)