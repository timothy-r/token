'use strict';

const db = require('../lib/db');
const hash = require('../lib/hash');

/**
 * get a token by its id
 */
module.exports.handler = (event, context, callback) => {

    const id = event.pathParameters.id;

    db.get(id, function(err, result){

        let response = {
            statusCode: null,
            body: null
        };

        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify(err);

        } else if (result.Item) {

            // add an ETag header
            const data = JSON.stringify(result.Item.data);
            const etag = hash.md5(data);

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