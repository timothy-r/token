'use strict';

var AWS = require('aws-sdk');
AWS.config.update({region: process.env.SERVERLESS_REGION});

const hash = require('../lib/hash');

/**
 * insert item into cache
 *
 * @param id
 * @param data
 * @param expires
 * @param callback
 */
module.exports.put = (id, data, expires, callback) => {

};

/**
 * get item with id from cache
 *
 * @param id
 * @param callback
 */
module.exports.get = (id, callback) => {


/**
 * get item with id & etag from cache
 *
 * @param id token object id
 * @param etag expected hash of token object
 * @param callback
 */
module.exports.getWithETag = (id, etag, callback) => {

};


/**
 * delete item with id from cache
 *
 * @param id
 * @param callback
 */
module.exports.delete = (id, callback) => {


};