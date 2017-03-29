'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.SERVERLESS_REGION});
var client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const db = require('../lib/db');

/**
 * store a new token
 */
module.exports.handler = (event, context, callback) => {

    const id = event.pathParameters.id;
    const data = JSON.parse(event.body);
    
    db.put(id, data, function(err, result) {

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
