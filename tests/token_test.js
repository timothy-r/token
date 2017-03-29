const request = require('supertest');
const chai = require('chai');
const assert = chai.assert;
const uuid = require('uuid');

const token_endpoint = process.env.TOKEN_ENDPOINT;

describe('Token service', function() {

    describe('Add token', function() {

        it('creates a token', function (done) {

            const id = uuid.v4();

            request(token_endpoint)
                .put('/' + id)
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
                    var token_url = token_endpoint + '/' + id;

                    console.log(token_url);

                    request('')
                        .get(token_url)
                        .expect(function(res){
                            assert.isTrue(
                                res.body.hasOwnProperty('creator'),
                                "Expected token object to have 'creator' property: " + JSON.stringify(res.body)
                            );
                            assert.isTrue(
                                res.headers.hasOwnProperty('etag'),
                                "Expected ETag header to be set: " + JSON.stringify(res.headers)
                            );
                        })
                        .expect(200, done);
                });


        });
    });

    describe('Delete token', function() {
       it('deletes a token', function(done){

           const id = uuid.v4();

           request(token_endpoint)
               .put('/' + id)
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

                   var token_url = token_endpoint + '/' + id;

                   request('')
                       .delete(token_url)
                       .expect(200)
                       .end(function(err, result){
                          if (err){
                              return done(err);
                          }
                          request('')
                              .get(token_url)
                              .expect(404, done)
                       });
               });
       });
    });
});
