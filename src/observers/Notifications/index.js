import { EventEmitter } from 'events'
import logger from '../../config/winston'
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

const notification = new ObservableNotifications()

notification
  .on('created', (notification) => {
    logger.info(`notification id ${notification['_id']} created`)
    return
  })
  .on('error', e => {
    logger.error(`failed notification creation ${e}`)
    return
  })

export default notification