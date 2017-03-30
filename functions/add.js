'use strict';

const db = require('../lib/db');

/**
 * store a token
 */
module.exports.handler = (event, context, callback) => {

    const id = event.pathParameters.id;
    const data = JSON.parse(event.body);
    const etag = event.headers['If-Match'];

    /**
     * first try to get this token with the etag
     * if it exists only allow overwrites if etag matches
     */
    db.getWithETag(id, etag, function(err, token) {

        let response = {
            statusCode: null,
            body: null
        };

        if (err) {

            if (err.error == 'NoMatch') {
                response.statusCode = 412;
            } else {
                response.statusCode = 500;
            }

            response.body = JSON.stringify(err);
            return callback(null, response);

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
