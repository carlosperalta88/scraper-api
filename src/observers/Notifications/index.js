import { EventEmitter } from 'events'
import NotificationService from '../../services/notifications'
import CasesService from '../../services/cases'

class ObservableNotifications extends EventEmitter {
  constructor() {
    super()
  }

  async add(payload) {
    try {
      const emails = await CasesService.getCaseUsers({ _id: payload['case_id']})
      const notification = await NotificationService.addNotification(payload['case_id'], payload['variation'], emails)
      this.emit('created', notification)
      return this
    } catch (error) {
      this.emit('error', error)
      return this
    }
  }
}

export default new ObservableNotifications()