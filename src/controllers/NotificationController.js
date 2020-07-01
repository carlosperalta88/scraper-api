const logger = require('../config/winston')
import NotificationService from '../services/notifications'

exports.notify = async (req, res, next) => {
  try {
    const emails = res.locals.storedVersion.users.map((user) => {
      return user.email
    })

    await NotificationService
        .addNotification(req.body.role, res.locals.caseDiff, emails)
    next()
  } catch (error) {
    logger.info(`Couldn't create notification for role 
    ${req.body.role} ${error}`)
    next()
  }
}
