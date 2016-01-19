'use strict';

var _mocha = require('mocha');

var _chai = require('chai');

var _auth = require('../../dist/auth');

(0, _mocha.describe)('auth.prelogin', function () {
  var nonExistingUsername = process.env.NON_EXISTING_USERNAME;
  var username = process.env.USERNAME;

  (0, _mocha.it)('should be defined and return false if parameter is not valid', function () {
    _chai.assert.ok(_auth.prelogin);
    _chai.assert.ok(!(0, _auth.prelogin)());
  });

  (0, _mocha.it)('should return a Promise if login parameter is given', function () {
    _chai.assert.ok((0, _auth.prelogin)({ login: username }) instanceof Promise);
  });

  (0, _mocha.it)('should resolve to an object if user exists', function (done) {
    (0, _auth.prelogin)({ login: username }).then(function (user) {
      _chai.assert.typeOf(user, 'object');
      _chai.assert.ok(user.id);
      _chai.assert.equal(user.username, username);
      done();
    }).catch(function () {
      done(new Error('env user does not exist'));
    });
  });

  (0, _mocha.it)('should reject with an error if user does not exist', function (done) {
    (0, _auth.prelogin)({ login: nonExistingUsername }).then(function () {
      done(new Error('env non-existing user exists'));
    }).catch(function (error) {
      _chai.assert.ok(error.message);
      done();
    });
  });
});