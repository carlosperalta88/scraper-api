const logger = require('../config/winston')
const Notifications = require('../models/Notifications')

class NotificationsService {
  constructor() {
    this.logger = logger
    this.notifications = Notifications
    this.NOTIFICATION_STATUS = {
      CREATED: 'CREATED',
      SENT: 'SENT',
      PARTIALLY_SENT: 'PARTIALLY_SENT',
      FAILED: 'FAILED'
    }
  }

  async addNotification(role, changes, emails) {
    const notification = new this.notifications({role, variations: changes, status: this.NOTIFICATION_STATUS.CREATED, emails })
    return await notification.save()
  }

  async getNotificationsToBeSent() {
    return await this.notifications.find({ status: this.NOTIFICATION_STATUS.CREATED })
  }

  async getNotificationsToRetry() {
    return await this.notifications.find({ status: { $in: [this.NOTIFICATION_STATUS.PARTIALLY_SENT, this.NOTIFICATION_STATUS.FAILED] } })
  }

  async getSentNotifications() {
    return await this.notifications.find({ status: this.NOTIFICATION_STATUS.SENT })
  }
}

module.exports = new NotificationsService()