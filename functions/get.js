'use strict';

const db = require('../lib/db');

/**
 * get a token by its id
 */
module.exports.handler = (event, context, callback) => {

    const id = event.pathParameters.id;

    db.get(id, function(err, token, etag){

        let response = {
            statusCode: null,
            body: null
        };

        if (err) {
            console.error(err);
            response.statusCode = 500;
            response.body = JSON.stringify(err);

        } else if (token) {

            response.statusCode = 200;
            response.body = JSON.stringify(token);
            response.headers = {
                ETag : etag
            };

        } else {

            response.statusCode = 404;
        }

        return callback(null, response);
    });
};