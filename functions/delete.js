'use strict';

const db = require('../lib/db');

/**
 * delete a token
 */
module.exports.handler = (event, context, callback) => {

    const id = event.pathParameters.id;

    db.delete(id, function(err, result) {

        let response = {
            statusCode: null,
            body: null
        };

        if (err) {
            response.statusCode = 500;
            response.body = JSON.stringify(err);

        } else {
            response.statusCode =  200;
            response.body = JSON.stringify({id: id})
        }

        return callback(null, response);
    });

};
