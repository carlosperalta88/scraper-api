import mongoose from 'mongoose'
let Schema = mongoose.Schema

let CourtsSchema = new Schema({
  name: { type: String, required: true },
  external_id: Number
})

CourtsSchema.statics.add = function(courts) {
  return await this.insertMany(courts)
}

CourtsSchema.statics.search = function(query) {
  return await this.find(query)
}

const Courts = mongoose.model('Courts', CourtsSchema)
export default Courts