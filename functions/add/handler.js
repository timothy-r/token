'use strict';

module.exports.add = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'succcess'
    }),
  };

  callback(null, response);

};
