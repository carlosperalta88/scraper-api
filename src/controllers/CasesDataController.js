import logger from '../config/winston'
import CasesDataService from '../services/casesData'

exports.add = async (req, res) => {
  try {
    await CasesDataService.add(req)
    logger.info(`${req.params.role} saved`)
    res.json({case: req.params.role}).status(204)
    return
  } catch (error) {
    logger.info(`failed saving the cause ${error}`)
    res.send(error).status(500)
    return
  }
}
