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

    client.delete(params, function(err, result) {

        let response = {
            statusCode: null,
            body: null
        };

        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify(err);

        } else {
            response.statusCode =  200;
            response.body = JSON.stringify({id: event.pathParameters.id})
        }

        return callback(null, response);
    });

};
