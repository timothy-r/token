'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.SERVERLESS_REGION});
var client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

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

    const params = {
        Item : {
            id: id,
            ttl: expires,
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
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id
        },
        TableName: process.env.TABLE_NAME
    };

    client.query(params, (err, result) => {
        if (err) {
            return callback(err);
        }

        if (result.Count) {
            const etag = hash.md5(JSON.stringify(result.Items[0].data));
            callback(null, result.Items[0], etag);
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
        KeyConditionExpression: "id = :id",
        ExpressionAttributeValues: {
            ":id": id
        },
        TableName: process.env.TABLE_NAME
    };

    client.query(params, (err, result) => {

        if (err) {
            return callback(err);
        }

        if (result.Count) {

            if (etag == hash.md5(JSON.stringify(result.Items[0].data))) {
                return callback(null, result.Items[0]);
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