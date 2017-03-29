'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.SERVERLESS_REGION});
var client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const db = require('../lib/db');
const hash = require('../lib/hash');

/**
 * store a new token
 */
module.exports.handler = (event, context, callback) => {

    const id = event.pathParameters.id;
    const data = JSON.parse(event.body);
    const etag = event.headers['If-Match'];

    // first try to get this token - if it exists only allow overwrites if etag matches
    db.get(id, function(err, result) {
        let response = {
            statusCode: null,
            body: null
        };

        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify(err);
            return callback(null, response);

        } else if (result.Item) {

            // if an item exists with this id then
            // disallow updates when client hasn't supplied the right Etag in the If-Match header
            const data = JSON.stringify(result.Item.data);
            const currentHash = hash.md5(data);

            if (currentHash != etag) {
                response.statusCode = 412;
                return callback(null, response);
            }
        }

        // go ahead and write
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

    });
};
