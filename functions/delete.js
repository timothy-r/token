'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.SERVERLESS_REGION});
var client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

/**
 * delete a token
 */
module.exports.handler = (event, context, callback) => {

  const params = {
    Key: {
      id: event.pathParameters.id
    },

    TableName: process.env.TABLE_NAME
  };

  client.delete(params, function(err, result){
    if (err) {
      return callback(null,
        {
          statusCode: 500,
          body: JSON.stringify(err)
        }
      );
    } else {
      return callback(null,
        {
          statusCode: 200,
          body: JSON.stringify({id: event.pathParameters.id})
        }
      );
    }
  });

};
