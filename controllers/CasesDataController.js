import logger from '../config/winston'
import CasesDataService from '../services/casesData'
import ObservableInsert from '../observers/Insert'
import NotificationObserver from '../observers/Notifications'

exports.add = async (req, res) => {
  try {
    const [updatedCase] = await CasesDataService.add(req)
    logger.info(`${req.params.role} saved`)
    ObservableInsert.checkInsert(updatedCase)
    res.json(updatedCase).status(204)
    return 
  } catch (error) {
    logger.info(`failed saving the cause ${error}`)
    res.send(error).status(500)
    return 
  }
}

ObservableInsert
  .on('compare', async (role) => {
    logger.info(`comparing role ${role['case_id']}`)
    const [latest] = await CasesDataService.getLatest(role['case_id'])

    if (!latest) {
      logger.info(`nothing to compare with ${role['case_id']}`)
      return
    }

    const comparison = CasesDataService.compare(role, latest)

    if (comparison.variation.length === 0) {
      logger.info(`no changes have been detected for ${role['case_id']}`)
      return
    }

    await NotificationObserver.add(comparison)
    return 
  })

NotificationObserver
  .on('created', (notification) => {
    logger.info(`notification id ${notification['_id']} created`)
    return
  })
  .on('error', e => {
    logger.error(`failed notification creation ${e}`)
    return
  })