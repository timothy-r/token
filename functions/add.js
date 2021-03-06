'use strict';

const db = require('../lib/db');

/**
 * store a token
 */
module.exports.handler = (event, context, callback) => {

    const id = event.pathParameters.id;
    const etag = event.headers['If-Match'];

    /**
     * first try to get this token with the etag
     * if it exists only allow overwrites if etag matches
     */
    db.getWithETag(id, etag, function(err, token) {

        if (err) {

            console.error(err);

            let response = {
                statusCode: null,
                body: JSON.stringify(err)
            };

            if (err.message == 'NoMatch') {
                response.statusCode = 412;
            } else {
                response.statusCode = 500;
            }

            return callback(null, response);

        }

        var expires = Date.now() +  process.env.TOKEN_EXPIRY;

        const data = JSON.parse(event.body);

        if (token) {
            expires = token.ttl;
        }

        // go ahead and write
        db.put(id, data, expires, function(err, result) {

            let response = {
                statusCode: 200,
                body: null
            };

            if (err) {
                console.error(err);

                response.statusCode = 500;
                response.body = JSON.stringify(err);
            }

            return callback(null, response);
        });
    });
};
