import sqs from '../../lib/sqs'
import logger from '../../config/winston'
import { EventEmitter } from 'events'
import ScraperObserver from '../Scraper'
import CasesDataService from '../../services/casesData'

class SQSObservable extends EventEmitter {
  constructor() {
    super()
  }

  async send(msg) {
    let payload = { case: decodeURI(msg) }
    let params = {
      MessageAttributes: {
        'case': {
          DataType: 'String',
          StringValue: payload.case
        }
      },
      DelaySeconds: 5,
      QueueUrl: process.env.SQS_Send,
      MessageBody: JSON.stringify(payload)
    }
    
    sqs.sendMessage(params, (err, data) => {
      if (err) {
        console.log(err)
        return this
      }
      this.emit('sqsSent', data)
      return this
    })
    return this
  }

  async receive() {
    let params = {
      MaxNumberOfMessages: 10,
      MessageAttributeNames: [
         "All"
      ],
      QueueUrl: process.env.SQS_Receive,
      VisibilityTimeout: 30,
      WaitTimeSeconds: 0
    }

    sqs.receiveMessage(params, (err, data) => {
      if (err) {
        console.log(err)
        return this
      }

      if(!data.Messages) {
        console.log(data)
        return this
      }

      console.log(`Messages pulled: ${data.Messages.length}`)
      data.Messages.map((el) => {
        let caseData = JSON.parse(el.Body)
        this.emit('addFromSQS', JSON.parse(caseData['case']))
        // console.log(JSON.parse(caseData['case']))
        const deleteParams = {
          QueueUrl: process.env.SQS_Receive,
          ReceiptHandle: el.ReceiptHandle
        }
    
        sqs.deleteMessage(deleteParams, (err, data) => {
          if (err) {
            console.log(err)
            return this
          }
          // console.log(data)
          console.log(`Message Deleted: ${data['ResponseMetadata']['RequestId']}`)
          return this
        })
      })
      if (data && data.Messages && data.Messages.length > 0) {
        this.receive()
        return this
      }
    })
    return this
  }
}

const sqsObservable = new SQSObservable()

sqsObservable
  .on('addFromSQS', async (payload) => {
    if (payload.error) {
      logger.info(payload)
      if (payload.case === 'undefined') return
      logger.info(`retry ${payload.case}`)
      ScraperObserver
        .add(payload.case)
        .sqsScrape()
        return
    }
    if (payload.case) return
    //ONLY FOR LOCAL USE
    logger.info(`adding CaseData ${payload.role_search[0].role}`)
    try {
      const [updatedCase] = await CasesDataService.add({ body: payload, params: { role: payload.role_search[0].role } })
      logger.info(`saved ${payload.role_search[0].role}`)
      return
    } catch (error) {
      logger.error(`sqs failed adding: ${error} ${JSON.stringify(payload['role_search'])}`)
      return
    }
  })
  .on('sqsSent', (res) => {
    if (!res.MessageId) {
      logger.error(`Error: ${res}`)
      return
    }
    logger.info(`sqs: ${res.MessageId}`)
    ScraperObserver.sqsScrape()
    return
  })

export default sqsObservable