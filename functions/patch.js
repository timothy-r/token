'use strict';

const db = require('../lib/db');

/**
 * edit an existing token
 */
module.exports.handler = (event, context, callback) => {

    const id = event.pathParameters.id;

    const etag = event.headers['If-Match'];

    /*
     * first try to get this token with the supplied etag
     * only allow overwrites if etag matches
     */
    db.getWithETag(id, etag, function(err, token) {

        let response = {
            statusCode: null,
            body: null
        };

        if (err) {
            console.error(err);
            if (err.messsage == 'NoMatch') {
                response.statusCode = 412;
            } else {
                response.statusCode = 500;
            }

            response.body = JSON.stringify(err);
            return callback(null, response);

        } else if (token) {

            // update current token data with body of request
            var newToken = Object.assign(token, JSON.parse(event.body));

            // write edited token
            db.put(id, newToken, function (err, result) {

                let response = {
                    statusCode: null,
                    body: null
                };

                if (err) {
                    console.error(err);
                    response.statusCode = 500;
                    response.body = JSON.stringify(err);

                } else {
                    response.statusCode = 200;
                }

                return callback(null, response);
            });

        } else {
            // no token with this id
            response.statusCode = 404;
            return callback(null, response);
        }
    });
};
