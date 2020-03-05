import mongoose from 'mongoose'
let Schema = mongoose.Schema

let RolesSchema = new Schema({
  name: { type: String, required: true }
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

RolesSchema.statics.add = async function(body) {
  return await new Roles(body).save()
}

RolesSchema.statics.get = function(name) {
  return this.find(name)
}

const Roles = mongoose.model('Roles', RolesSchema)
export default Roles