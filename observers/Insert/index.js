import { EventEmitter } from 'events'

class ObservableInsert extends EventEmitter {
  constructor() {
    super()
  }
  
  checkInsert(payload) {
    if (!payload) return this

    if (payload['document_status'] === 'Failed' || payload['document_status'] === '') {
      this.emit('retry', payload)
      return this
    }
    this.emit('compare', payload)
    return this
  }
}

module.exports = new ObservableInsert()