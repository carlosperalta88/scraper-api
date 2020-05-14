import { EventEmitter } from 'events'
import ExecutionService from '../../services/executions'

class ExecutionsObserver extends EventEmitter {
  constructor() {
    super()
  }

  async add (execution, data) {
    await ExecutionService.patch(execution['_id'], data)
    this.emit('rolesAdded', execution['_id'])
    return this
  }
}