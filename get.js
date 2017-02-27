'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.SERVERLESS_REGION});
var client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

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
      // add an ETag header
      return callback(null, result.Item.data);
    } else {
      return callback('[404]', {});
    }
  });

};