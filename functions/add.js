'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.SERVERLESS_REGION});
var client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

/**
 * create a new token, generate the id, respond with Location header
 */
module.exports.handler = (event, context, callback) => {

    const id = event.pathParameters.id;

    const params = {
        Item : {
            id: id,
            data: JSON.parse(event.body)
        },
        TableName: process.env.TABLE_NAME
    };

    client.put(params, function(err, result) {

        let response = {
            statusCode: null,
            body: null
        };

        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify(err);

        } else {
            response.statusCode =  200;
        }

        return callback(null, response);
    });
};
