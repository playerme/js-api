'use strict';

var _mocha = require('mocha');

var _chai = require('chai');

var _auth = require('../dist/auth');

(0, _mocha.describe)('auth tests', function () {
  var username = process.env.USERNAME;

  (0, _mocha.it)('prelogin', function (done) {
    (0, _auth.prelogin)({ login: username }).then(function (user) {
      _chai.assert.typeOf(user, 'object');
      _chai.assert.ok(user.id, 'user has an id');
      _chai.assert.equal(user.username, username, 'username is equal to env username');
      done();
    }).catch(function () {
      done(new Error('env user does not exist'));
    });
  });
});