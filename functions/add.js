'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.SERVERLESS_REGION});
var client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

var uuid = require('uuid');

/**
 * create a new token, generate the id, respond with Location header
 */
module.exports.handler = (event, context, callback) => {

  const id = uuid.v4();

  let host = event.headers.Host;
  let stage = event.requestContext.stage;

  // create the url this token will be available at
  // ought to provide this as an env var?

  const url = 'https://' + host + '/' + stage + '/' + id;

  const params = {
    Item : {
      id: id,
      data: JSON.parse(event.body)
    },
    TableName: process.env.TABLE_NAME
  };

  client.put(params, function(err, result) {
    if (err) {
          return callback('[500]', err);
      } else {
          return callback(null, {
            statusCode: 200,
            headers: {
              "Location" : url
            },
            body: JSON.stringify({
              id: id
            })
          });
      }
  });
};
