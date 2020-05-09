import sqs from '../../lib/sqs'
import { EventEmitter } from 'events'

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

export default new SQSObservable()