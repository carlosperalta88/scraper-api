import logger from '../config/winston'
import ReportsService from '../services/reports'
import request from '../lib/api'

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
    const data = await ReportsService.getReport(req.body.client)
    const payload = {
      json: true,
      uri: `${process.env.REPORT_URL}/generate`,
      method: 'POST',
      body: { data }
    }

    const response = await request.do(payload)
    res.json(response)
  } catch (error) {
    logger.error(`failed formatting the cause ${error}`)
    res.send(error).status(500)
  }
}

