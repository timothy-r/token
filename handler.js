'use strict';

module.exports.add = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'succcess'
    })
  };

  callback(null, response);

};

module.exports.get = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'succcess'
    })
  };

  callback(null, response);

};

module.exports.update = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'succcess'
    })
  };

  callback(null, response);

};


module.exports.delete = (event, context, callback) => {
  const response = {
    statusCode: 200,
    body: JSON.stringify({
      message: 'succcess'
    })
  };

  callback(null, response);

};
