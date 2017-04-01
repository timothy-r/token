'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.SERVERLESS_REGION});
var ddb = new AWS.DynamoDB({maxRetries: 20, apiVersion: '2012-08-10'});
var client = new AWS.DynamoDB.DocumentClient({service: ddb});

const hash = require('../lib/hash');

/**
 * insert item into ddb
 *
 * @param id
 * @param data
 * @param expires
 * @param callback
 */
module.exports.put = (id, data, expires, callback) => {

    const md5Sum = hash.md5(JSON.stringify(data));

    const params = {
        Item : {
            id: id,
            ttl: expires,
            md5Sum: md5Sum,
            data: data
        },
        TableName: process.env.TABLE_NAME
    };

    client.put(params, callback);
};

/**
 * get item with id from ddb
 *
 * @param id
 * @param callback
 */
module.exports.get = (id, callback) => {

    const params = {
        Key: {
            id: id
        },

        TableName: process.env.TABLE_NAME
    };

    client.get(params, (err, result) => {
        if (err) {
            return callback(err);
        }

        if (result.Item) {
            callback(null, result.Item);
        } else {
            // not found
            callback();
        }
    });
};

/**
 * get item with id & etag from ddb
 *
 * @param id token object id
 * @param etag expected hash of token object
 * @param callback
 */
module.exports.getWithETag = (id, etag, callback) => {

    const params = {
        Key: {
            id: id
        },

        TableName: process.env.TABLE_NAME
    };

    client.get(params, (err, result) => {

        if (err) {
            return callback(err);
        }

        if (result.Item) {

            if (etag == result.Item.md5Sum) {
                return callback(null, result.Item);
            }

            return callback({message: "NoMatch"});

        } else {
            return callback();
        }
    });
};


/**
 * delete item with id from ddb
 *
 * @param id
 * @param callback
 */
module.exports.delete = (id, callback) => {

    const params = {
        Key: {
            id: id
        },

        TableName: process.env.TABLE_NAME
    };

    client.delete(params, callback);

};