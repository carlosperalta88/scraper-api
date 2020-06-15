import { EventEmitter } from 'events'
import logger from '../../config/winston'
import ReportsService from '../../services/reports'
import request from '../../lib/api'

class ObservableReport extends EventEmitter {
  constructor() {
    super()
  }
  
  async create(query) {
    try {
      const data = await ReportsService.getReport(query)
      const payload = {
        json: true,
        uri: `${process.env.REPORT_URL}/generate`,
        method: 'POST',
        body: { data }
      }
    
      const response = await request.do(payload)
      this.emit('reportResponse', response)
      return this
    } catch (error) {
      this.emit('reportsError', error)
      return this
    }
  }
}

const report = new ObservableReport()

report
  .on('reportResponse', (response) => {
    logger.info(response)
    return
  })
  .on('reportsError', (error) => {
    logger.info('reportsError')
    logger.error(error)
    return
  })

module.exports = new ObservableReport()