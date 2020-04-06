import { EventEmitter } from 'events'
import ReportsService from '../../services/reports'
import request from '../../lib/api'

class ObservableReport extends EventEmitter {
  async create(client) {
    try {
      const data = await ReportsService.getReport(client)
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

module.exports = new ObservableReport()