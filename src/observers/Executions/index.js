/* eslint-disable require-jsdoc */
import {EventEmitter} from 'events'
import ExecutionService from '../../services/executions'
import CasesDataService from '../../services/casesData'
import logger from '../../config/winston'

class ExecutionsObserver extends EventEmitter {
  constructor() {
    super()
  }

  async add(execution, data) {
    await ExecutionService.patch(execution['_id'], data)
        .catch((err) => console.error(err))
    this.emit('rolesAdded', execution['_id'])
    return this
  }

  async check(executionId) {
    logger.info(`Starting execution for ${executionId}`)
    const casesData = await ExecutionService.getChanges(executionId)
    logger.info(`Comparing Roles`)
    this.checkRolesFromExecution(casesData)
    return
  }

  checkRolesFromExecution(casesData) {
    for (const data of casesData) {
      const comparisson = CasesDataService.compare(data['cases'])
      if (comparisson.length > 0) {
        console.log(`${data['external_id']}, `, comparisson)
      }
    }
    return `done`
  }
}

const executions = new ExecutionsObserver()

executions.on('rolesAdded', function(eid) {
  console.log(`Execution id: ${eid}`)
})

export default executions
