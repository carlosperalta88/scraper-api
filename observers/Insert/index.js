import { EventEmitter } from 'events'

class ObservableInsert extends EventEmitter {
  checkInsert(payload) {
    if (!payload) return this

    if (payload['document_status'] === 'Failed') {

      this.emit('retry', payload)
      return this
    }

    return this
  } 
}

module.exports = new ObservableInsert()