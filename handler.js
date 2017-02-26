'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.SERVERLESS_REGION});
var client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

var uuid = require('uuid');

/**
 * create a new token, generate the id here
 */
module.exports.add = (event, context, callback) => {

  const id = uuid.v4();

  // create the url this token will be available at
  // ought to provide this as an env var
  // const url = 'https://' + apiId + '.execute-api.' + region + '.amazonaws.com/' + stage + / + id;

  const params = {
    Item : {
      id: id,
      data: JSON.parse(event.body)
    },
    TableName: process.env.TABLE_NAME
  };

  client.put(params, function(err, result) {
    if (err) {
          return callback(err);
      } else {
          return callback(null, {
            statusCode: 200,
            headers: {
              "Location" : "/" + id
            },
            body: JSON.stringify({
              id: id
            })
          });
      }
  });
};

/**
 * get a token by its id
 */
module.exports.get = (event, context, callback) => {

  const params = {
    Key: {
      id: event.path.id
    },

    TableName: process.env.TABLE_NAME
  };

  client.get(params, function(err, result){
    if (err) {
      return callback(err);
    } else if (result.Item) {
      return callback(null, result.Item.data);
    } else {
      return callback('not-found');
    }
  });

};

/**
 * Update an exisiting token
 */
module.exports.update = (event, context, callback) => {

  const params = {
    Key: {
      id: event.path.id
    },

    TableName: process.env.TABLE_NAME
  };


  callback(null, {});

};

/**
 * delete a token
 */
module.exports.delete = (event, context, callback) => {

  const params = {
    Key: {
      id: event.path.id
    },

    TableName: process.env.TABLE_NAME
  };

  client.delete(params, function(err, result){
    if (err) {
      return callback(err);
    } else {
      return callback(null, event.path.id);
    }
  });

};
