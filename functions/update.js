'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.SERVERLESS_REGION});
var client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

/**
 * Update an exisiting token
 */
module.exports.handler = (event, context, callback) => {

  const params = {
    Key: {
      id: event.pathParameters.id
    },

    TableName: process.env.TABLE_NAME
  };

  callback(null, {});

};
