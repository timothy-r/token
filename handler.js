'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.SERVERLESS_REGION});
var client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

var uuid = require('uuid');

module.exports.add = (event, context, callback) => {

  const id = uuid.v4();

  // create the url this token will be available at
  // ought to provide this as an env var
  // const url = 'https://' + apiId + '.execute-api.' + region + '.amazonaws.com/' + stage + / + id;

  const params = {
    Item : {
      id: id,
      data: event.body
    },
    TableName: process.env.TABLE_NAME
  };

  client.put(params, function(err, result) {
    if (err) {
          return callback(err);
      } else {
          return callback(null, {
            statusCode: 200,
            body: JSON.stringify({
              id: id
            })
          });
      }
  });
};

module.exports.get = (event, context, callback) => {

  const params = {
    Key: {
      id: event.id
    },

    TableName: process.env.TABLE_NAME
  };

  client.get(params, function(err, result){
    if (err) {
      return callback(err);
    } else if (result.Item) {
      return callback(null, result.Item);
    } else {
      return callback('not-found');
    }
  });

};

module.exports.update = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'succcess'
    })
  };

  callback(null, response);

};


module.exports.delete = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'succcess'
    })
  };

  callback(null, response);

};
