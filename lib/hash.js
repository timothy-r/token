const crypto = require('crypto');

/**
 * return an md5 sum of data
 *
 * @param data
 * @returns string
 */
module.exports.md5 = (data) => {

    var hash = crypto.createHash('md5');
    return hash.update(data).digest('hex');
};