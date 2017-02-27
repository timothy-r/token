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
      id: event.path.id
    },

    TableName: process.env.TABLE_NAME
  };

  client.get(params, function(err, result){
    if (err) {
      return callback('[500]', err);
    } else if (result.Item) {

      const data = result.Item.data;
      hash.update(data);

      // add an ETag header
      return callback(null, {
        statusCode: 200,
        headers: {
          "ETag" : hash.digest('hex')
        },
        body: data
      });

      //return callback(null, result.Item.data);
    } else {
      return callback('[404]', {});
    }
  });
};