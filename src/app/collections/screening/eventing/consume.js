var AWS       = require('aws-sdk');
var util      = require('util');
const awsConf = require('config').get('aws');


// configure AWS
AWS.config.update({
    accessKeyId: awsConf.sns.credentials.aws_access_key_id,
    secretAccessKey: awsConf.sns.credentials.aws_secret_access_key,
    region: awsConf.sns.SNS_REGION
});

var sqs = new AWS.SQS();

function getCredentials(awsConf) {
    if(!awsConf.sns.endpoint.user || awsConf.sns.endpoint.user == "") return ""
    if(!awsConf.sns.endpoint.pass || awsConf.sns.endpoint.pass == "") return ""
    return awsConf.sns.endpoint.user + "@" + awsConf.sns.endpoint.pass + ":"
}

const endpoint = awsConf.sns.endpoint.protocol + getCredentials(awsConf) + awsConf.sns.endpoint.host + ":" + awsConf.sns.endpoint.port + awsConf.sns.endpoint.host + awsConf.sns.endpoint.path

var receiveMessageParams = {
    QueueUrl: endpoint,
    MaxNumberOfMessages: 10
};

function getMessages() {
    sqs.receiveMessage(receiveMessageParams, receiveMessageCallback);
}

function receiveMessageCallback(err, data) {
    if (data && data.Messages && data.Messages.length > 0) {
        for (var i=0; i < data.Messages.length; i++) {
            process.stdout.write(".");
            var deleteMessageParams = {
                QueueUrl: endpoint,
                ReceiptHandle: data.Messages[i].ReceiptHandle
            };
            sqs.deleteMessage(deleteMessageParams, deleteMessageCallback);
        }
        getMessages();
    } else {
        process.stdout.write("-");
        setTimeout(getMessages, 100);
    }
}

function deleteMessageCallback(err, data) {
}

setTimeout(getMessages, 100);

