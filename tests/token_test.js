const request = require('supertest');
const chai = require('chai');
const assert = chai.assert;
const uuid = require('uuid');

// expected format https://lck74cbmxh.execute-api.eu-west-1.amazonaws.com/dev
const token_endpoint = process.env.TOKEN_ENDPOINT;

var token_url = '';

describe('Token service', function() {

    beforeEach(() => {
        token_url = token_endpoint + '/tokens/' + uuid.v4();
    });

    describe('Get token', () => {
        it('Returns 404 if token does not exist', (done) => {
            request(token_endpoint)
                .get('/tokens/not-a-token-id')
                .expect(404, done);
        });
    });

    describe('Add token', () => {

        it('creates a token', (done) => {

            request('')
                .put(token_url)
                .set('Content-Type', 'application/json')
                .send(
                    {
                        "creator": "tim.rodger@sputnik.net",
                        "status": "active",
                        "count" : 0,
                        "created" : Date.now()
                    })
                .expect(200)
                .end(function(err, result){
                    if (err) {
                        return done(err);
                    }

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

        it('prevents overwriting token without If-Match header', (done) => {

            request('')
                .put(token_url)
                .set('Content-Type', 'application/json')
                .send(
                    {
                        "creator": "tim.rodger@sputnik.net",
                        "status": "active",
                        "count" : 0,
                        "created" : Date.now()
                    })
                .expect(200)
                .end(function(err, result){
                    if (err) {
                        return done(err);
                    }

                    request('')
                        .put(token_url)
                        .set('Content-Type', 'application/json')
                        .send(
                            {
                                "creator": "frank.smithson@sputnik.net",
                                "status": "deleted",
                                "count" : 9,
                                "created" : Date.now()
                            })
                        .expect(412, done);
                });

        });

        it('prevents overwriting token with invalid If-Match header', (done) => {

            request('')
                .put(token_url)
                .set('Content-Type', 'application/json')
                .send(
                    {
                        "creator": "tim.rodger@sputnik.net",
                        "status": "active",
                        "count" : 0,
                        "created" : Date.now()
                    })
                .expect(200)
                .end(function(err, result){
                    if (err) {
                        return done(err);
                    }

                    request('')
                        .put(token_url)
                        .set('Content-Type', 'application/json')
                        .set('If-Match', 'invalid')
                        .send(
                            {
                                "creator": "frank.smithson@sputnik.net",
                                "status": "deleted",
                                "count" : 9,
                                "created" : Date.now()
                            })
                        .expect(412, done);
                });

        });

        it('allow overwriting token with valid If-Match header', (done) => {

            request('')
                .put(token_url)
                .set('Content-Type', 'application/json')
                .send(
                    {
                        "creator": "tim.rodger@sputnik.net",
                        "status": "active",
                        "count" : 0,
                        "created" : Date.now()
                    })
                .expect(200)
                .end(function(err, result){
                    if (err) {
                        return done(err);
                    }

                    request('')
                        .get(token_url)
                        .expect(200)
                        .end(function(err, res){
                            if (err) {
                                return done(err);
                            }

                            var etag = res.headers.etag;

                            request('')
                                .put(token_url)
                                .set('Content-Type', 'application/json')
                                .set('If-Match', etag)
                                .send(
                                    {
                                        "creator": "frank.smithson@sputnik.net",
                                        "status": "deleted",
                                        "count" : 9,
                                        "created" : Date.now()
                                    })
                                .expect(200, done);
                        });
                });

        });
    });

    describe('Delete token', () => {
       it('deletes a token', (done) => {

           request('')
               .put(token_url)
               .set('Content-Type', 'application/json')
               .send(
                   {
                       "creator": "tim.rodger@sputnik.net",
                       "status": "active",
                       "count" : 0,
                       "created" : Date.now()
                   })
               .expect(200)
               .end(function(err, result){
                   if (err) {
                       return done(err);
                   }

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

        it('succeeds with missing token', (done) => {

            request('')
                .delete(token_url)
                .expect(200, done);
        });
    });

    describe('Patch token', () => {
        it('fails for a missing token', (done) => {
            request('')
                .patch(token_url)
                .expect(404, done);
        });

        it('prevents patching token without If-Match header', (done) => {

            request('')
                .put(token_url)
                .set('Content-Type', 'application/json')
                .send(
                    {
                        "creator": "tim.rodger@sputnik.net",
                        "status": "active",
                        "count" : 0,
                        "created" : Date.now()
                    })
                .expect(200)
                .end(function(err, result){
                    if (err) {
                        return done(err);
                    }

                    request('')
                        .patch(token_url)
                        .set('Content-Type', 'application/json')
                        .send(
                            {
                                "count" : 9
                            })
                        .expect(412, done);
                });

        });

        it('prevents patching token with invalid If-Match header', (done) => {

            request('')
                .put(token_url)
                .set('Content-Type', 'application/json')
                .send(
                    {
                        "creator": "tim.rodger@sputnik.net",
                        "status": "active",
                        "count" : 0,
                        "created" : Date.now()
                    })
                .expect(200)
                .end(function(err, result){
                    if (err) {
                        return done(err);
                    }

                    request('')
                        .patch(token_url)
                        .set('Content-Type', 'application/json')
                        .set('If-Match', 'invalid')
                        .send(
                            {
                                "count" : 9
                            })
                        .expect(412, done);
                });

        });

        it('allow patching token with valid If-Match header', (done) => {

            request('')
                .put(token_url)
                .set('Content-Type', 'application/json')
                .send(
                    {
                        "creator": "tim.rodger@sputnik.net",
                        "status": "active",
                        "count": 0,
                        "created": Date.now()
                    })
                .expect(200)
                .end(function (err, result) {
                    if (err) {
                        return done(err);
                    }

                    request('')
                        .get(token_url)
                        .expect(200)
                        .end(function (err, res) {
                            if (err) {
                                return done(err);
                            }

                            var etag = res.headers.etag;

                            request('')
                                .patch(token_url)
                                .set('Content-Type', 'application/json')
                                .set('If-Match', etag)
                                .send(
                                    {
                                        "count": 1
                                    })
                                .expect(200)
                                .end(function(err, result) {
                                    if (err) {
                                        return done(err);
                                    }
                                    request('')
                                        .get(token_url)
                                        .expect(200)
                                        .end(function(err, result) {
                                            assert.isTrue(result.body.count == 1);
                                            assert.isTrue(result.body.creator == "tim.rodger@sputnik.net");
                                            assert.isTrue(result.body.status == 'active');
                                            done();
                                        });
                                });
                        });
                });
            });

        });
});
