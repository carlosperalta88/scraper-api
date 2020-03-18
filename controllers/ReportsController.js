import logger from '../config/winston'
import ReportsService from '../services/reports'

exports.buildReport = async (req, res) => {
  try {
    const response = await ReportsService.add(req.params.client)
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
    const data = await ReportsService.get(req.query)
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

