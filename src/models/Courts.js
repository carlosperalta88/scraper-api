import mongoose from 'mongoose'
let Schema = mongoose.Schema

let CourtsSchema = new Schema({
  name: { type: String, required: true },
  external_id: { type: Number, require: true, unique: false}
})

CourtsSchema.statics.add = function(courts) {
  return this.insertMany(courts)
}

CourtsSchema.statics.search = function(query) {
  return this.find(query)
}

const Courts = mongoose.model('Courts', CourtsSchema)
export default Courts