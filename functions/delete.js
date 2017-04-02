'use strict';

const store = require('../lib/db');

/**
 * delete a token
 */
module.exports.handler = (event, context, callback) => {

    const id = event.pathParameters.id;

    store.delete(id, function(err, result) {

        let response = {
            statusCode: null,
            body: null
        };

        if (err) {
            console.error(err);
            response.statusCode = 500;
            response.body = JSON.stringify(err);

        } else {
            response.statusCode =  200;
            response.body = JSON.stringify({id: id})
        }

        return callback(null, response);
    });

};
