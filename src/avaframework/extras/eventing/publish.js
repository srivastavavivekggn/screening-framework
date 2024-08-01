const awsConf = require('config').get('aws');
const AWS     = require('aws-sdk');
const log     = require('bunyan').createLogger({name : require('../../../../package.json').name});


module.exports = function() {

    AWS.config.update({
        accessKeyId: awsConf.sns.credentials.aws_access_key_id,
        secretAccessKey: awsConf.sns.credentials.aws_secret_access_key,
        region: awsConf.sns.sns_region
    })

    const sns = new AWS.SNS()

    function publish(topic, msg) {
        const publishParams = {
            TopicArn: awsConf.sns.application_arn + topic,
            Message: msg
        }
        sns.publish(publishParams, function (err, data) {
            err ? log.error(`Eventing Error: ${err} : ${JSON.stringify(msg)}`) : log.info(`Eventing Success: ${JSON.stringify(msg)}`)
        })
    }

    return publish
}()

