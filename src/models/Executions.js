import mongoose from 'mongoose'

const Schema = mongoose.Schema

const ExecutionSchema = new Schema({
  "role_external_ids": [{ type: String, required: false, unique: false }]
}, { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }})

ExecutionSchema.statics.create = async function() {
  return await new Executions().save()
}

ExecutionSchema.statics.update = function(execution_id, roles) {
  return this.updateOne({ _id: execution_id }, 
    { $push: {
      role_external_ids: {
        $each: roles
      }
    } 
  })
}

ExecutionSchema.statics.get = function(execution_id) {
  return this.find({ _id: execution_id })
}

const Executions = mongoose.model('Executions', ExecutionSchema)
export default Executions