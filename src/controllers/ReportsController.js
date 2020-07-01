import logger from '../config/winston'
import ReportsService from '../services/reports'
import reportObserver from '../observers/Reports'

exports.buildReport = async (req, res) => {
  try {
    const response = await ReportsService.getReport(req.body.query)
    res.json(response)
  } catch (error) {
    logger.error(`failed formatting the cause ${error}`)
    res.send(error).status(500)
  }
}

exports.getReports = async (req, res) => {
  try {
    const response = await ReportsService.get(req.params.client)
    res.json(response)
  } catch (error) {
    logger.error(`failed formatting the cause ${error}`)
    res.send(error).status(500)
  }
}

exports.exportReport = async (req, res) => {
  try {
    reportObserver.create(req.body.query)
    res.json({message: 'generating report'})
  } catch (error) {
    logger.error(`failed formatting the cause ${error}`)
    res.send(error).status(500)
  }
}
