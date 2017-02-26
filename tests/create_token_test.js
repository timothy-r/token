const request = require('supertest');
const chai = require('chai');
const assert = chai.assert;

var token_endpoint = process.env.TOKEN_ENDPOINT;

describe('Token service', function() {

    describe('Add token', function() {

        it('creates a token', function (done) {

            var path = '/';

            request(token_endpoint)
                .post(path)
                .set('Content-Type', 'application/json')
                .send(
                    {
                        "creator": "tim.rodger@sputnik.net",
                        "status": "active",
                        "count" : 0
                    })
                .expect(200)
                .end(function(err, result){
                    if (err) {
                        return done(err);
                    }

                    // get the token url from response header
                    var token_endpoint = result.res.headers.location;

                    request('')
                        .get(token_endpoint)
                        .expect(function(res){
                            assert.isTrue(
                                res.body.hasOwnProperty('creator'),
                                "Expected token object to have 'creator' property: " + JSON.stringify(res.body)
                            );
                        })
                        .expect(200, done);
                });


        });
    });

    describe('Delete token', function() {
       it('deletes a token', function(done){
           var path = '/';

           request(token_endpoint)
               .post(path)
               .set('Content-Type', 'application/json')
               .send(
                   {
                       "creator": "tim.rodger@sputnik.net",
                       "status": "active",
                       "count" : 0
                   })
               .expect(200)
               .end(function(err, result){
                   if (err) {
                       return done(err);
                   }
                   // get the token url from response header
                   var token_endpoint = result.res.headers.location;

                   request('')
                       .delete(token_endpoint)
                       .expect(200, done);
               });
       });
    });
});
