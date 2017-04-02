'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.SERVERLESS_REGION});

var redis = require("redis");
var client = redis.createClient();

const hash = require('../lib/hash');

/**
 * insert item with id
 *
 * @param id
 * @param data
 * @param expires
 * @param callback
 */
module.exports.put = (id, data, expires, callback) => {

    client.hmset(
        [id, "data", JSON.stringify(data), "md5Sum", hash.md5(JSON.stringify(data))],
        callback
    );
};

/**
 * get item with id
 *
 * @param id
 * @param callback
 */
module.exports.get = (id, callback) => {

    client.hmget(id, "data", "md5Sum", (err, result) => {
        if (err){
            callback(err);
        } else {
            callback(null, JSON.parse(result));
        }
    });
};

/**
 * get item with id & etag
 *
 * @param id token object id
 * @param etag expected hash of token object
 * @param callback
 */
module.exports.getWithETag = (id, etag, callback) => {

    client.hmget(id, "data", "md5Sum", (err, result) => {
        if (err){
            callback(err);
        } else {
            if (etag == result.etag) {
                callback(null, JSON.parse(result));
            } else {
                return callback({message: "NoMatch", token: id, provided: etag, current: result.md5Sum});
            }
        }
    });

};

/**
 * delete item with id
 *
 * @param id
 * @param callback
 */
module.exports.delete = (id, callback) => {

    client.hdel(id, "data", "md5Sum", callback);

};