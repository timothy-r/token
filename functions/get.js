'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.SERVERLESS_REGION});
const client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const crypto = require('crypto');

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

        let response = {
            statusCode: null,
            body: null
        };

        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify(err);

        } else if (result.Item) {

            var hash = crypto.createHash('md5');

            // add an ETag header
            const data = JSON.stringify(result.Item.data);
            const etag = hash.update(data).digest('hex');

            response.statusCode = 200;
            response.body = data;
            response.headers = {
                ETag : etag
            };

        } else {

            response.statusCode = 404;
        }

        return callback(null, response);
    });
};