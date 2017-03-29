'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.SERVERLESS_REGION});
var client = new AWS.DynamoDB.DocumentClient({apiVersion: '2012-08-10'});

const table_name = process.env.TABLE_NAME;

/**
 * insert item into ddb
 *
 * @param id
 * @param data
 * @param callback
 */
module.exports.put = (id, data, callback) => {

    const params = {
        Item : {
            id: id,
            data: data
        },
        TableName: table_name
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

        TableName: table_name
    };

    client.get(params, callback);
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

        TableName: table_name
    };

    client.delete(params, callback);
};