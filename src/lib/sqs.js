import AWS from 'aws-sdk'

const credentials = new AWS.SharedIniFileCredentials({profile: 'mini'});

AWS.config.update({ region: 'us-east-2'})
AWS.config.credentials = credentials;

export default new AWS.SQS({apiVersion: '2012-11-05'})