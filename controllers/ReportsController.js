import logger from '../config/winston'
import ReportsService from '../services/reports'
import request from '../lib/api'
import reportObserver from '../observers/Reports'

exports.buildReport = async (req, res) => {
  try {
    const response = await ReportsService.getReport(req.body.client)
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
    reportObserver.create(req.body.client)
    res.json({ message: 'generating report' })
  } catch (error) {
    logger.error(`failed formatting the cause ${error}`)
    res.send(error).status(500)
  }
}

reportObserver
  .on('reportResponse', (response) => {
    logger.info(response)
    return
  })
  .on('reportsError', (error) => {
    logger.info('reportsError')
    logger.error(error)
    return
  })