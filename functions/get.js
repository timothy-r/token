'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.SERVERLESS_REGION});
const client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const crypto = require('crypto');
const hash = crypto.createHash('md5');

/**
 * get a token by its id
 */
module.exports.handler = (event, context, callback) => {

  const params = {
    Key: {
      id: event.pathParameters.id
    },

    TableName: process.env.TABLE_NAME
  };

  client.get(params, function(err, result){
    if (err) {
      const response = {
        statusCode: 500,
        body: JSON.stringify(err)
      };
      return callback(null, response);
    } else if (result.Item) {

      // add an ETag header
      const data = result.Item.data;
      const etag = hash.update(JSON.stringify(data)).digest('hex');

      const response = {
        statusCode: 200,
        headers: {
          "ETag" : etag
        },
        body: JSON.stringify(data)
      };

      return callback(null, response);
    } else {
      return callback(null, {statusCode: 404, body: ""});
    }
  });
};