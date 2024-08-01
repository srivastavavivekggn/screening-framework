'use strict';

const AWS   = require('aws-sdk');
const async = require('async');

module.exports = function(log4js, config) {

  const logger = log4js.getLogger('SNSEventingService');

  const sns = new AWS.SNS({
    "accessKeyId":     config['sns'].accessKey,
    "secretAccessKey": config['sns'].secretKey,
    "region":          config['sns'].region
  });

  /**
   *
   * @param source The source of the payload.  Typically, this will be the name of a service, app, etc.  Example : 'slideshows-microservice'
   * @param serviceBaseUri The service 'base' Uri where the fill data
   * @param eventType What type/category of data the payload is.  Examples might be 'content' or 'q&a', etc.
   * @param uri The resource Id of the object being sent.  This will allow the subscriber to the event to pull the
   *   current, full state of the object using the serviceBaseUri parameter.
   * @param data Optional.  Any additional data that may need to be present for the event.
   * @return {{source: (*|string|Window), timestamp: number, event: *, url: string}}
   * @private
   */
  const build = (source, serviceBaseUri, eventType, uri, data) => {
    if (logger.level.level <= 5000)
      logger.trace(`build()`);
    var event = {
      "source":    source,
      "timestamp": Math.round(+new Date()),
      "event":     eventType,
      "url":       serviceBaseUri + "/" + uri
    };

    if (data) {
      event.data = data;
    }

    return event;
  };

  /**
   * Sends an event to Amazon SNS
   *
   * @param params The JSON document specifying the target ARN and the data (message) that is intended to be sent,
   * @return If the call is successful, the transaction ID from Amazon is return to the client; otherwise, the error
   *   object is returned
   * @private
   * @returns {Promise}
   */
  const publishEvent = (params) => {
    if (logger.level.level <= 5000)
      logger.trace(`publishEvent()`);

    return new Promise((resolve, reject) => {
      async.retry(
          config['sns'].maxRetries,
          function(callback) {
            sns.publish(params, function(error, response) {
              if (error) return callback(error);
              callback(null, response.MessageId);
            });
          },
          function(err, messageId) {
            if (err) return reject(err);
            resolve(messageId);
          }
      );
    });
  };

  /**
   * Prepares an event payload and sends it to Amazon SNS using the configures credentials and topic ARN.  This
   * function includes optional data that may also need to be sent with the event.
   *
   * @param source The source of the payload.  Typically, this will be the name of a service, app, etc.  Example : 'slideshows-microservice'
   * @param serviceBaseUri The service 'base' Uri where the fill data
   * @param targetArn The Topic ARN to send the event to.  This must already exist in SNS.
   * @param event Where the data came from.  For example, the name of an application, web service, ETL process, etc.
   * @param uri The resource Id of the object being sent.  This will allow the subscriber to the event to pull the
   *   current, full state of the object.
   * @param [data] Any additional data that may need to be present for the event.  Optional.
   * @returns {Promise}
   */
  const send = (source, serviceBaseUri, targetArn, event, uri, data) => {
    return publishEvent({
      TargetArn: targetArn,
      Message:   JSON.stringify(build(source, serviceBaseUri, event, uri, data))
    }).then(messageId => {
      return messageId;
    }).catch(err => {
      return err;
    });
  };

  return {
    send
  };

};
