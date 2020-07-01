import mongoose from 'mongoose'
import basicMethods from '../lib/basic-model-methods'

const Schema = mongoose.Schema

const ExecutionSchema = new Schema({
  'role_external_ids': [{type: String, required: false, unique: false}],
}, {timestamps: {createdAt: 'created_at', updatedAt: 'updated_at'}})

ExecutionSchema.plugin(basicMethods)

ExecutionSchema.statics.update = function(executionId, roles) {
  return this.updateOne({_id: executionId},
      {$push: {
        role_external_ids: {
          $each: roles,
        },
      },
      })
}


const Executions = mongoose.model('Executions', ExecutionSchema)
export default Executions
