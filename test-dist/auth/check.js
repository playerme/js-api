'use strict';

var _mocha = require('mocha');

var _chai = require('chai');

var _auth = require('../../dist/auth');

(0, _mocha.describe)('auth.check', function () {
  var nonExistingUsername = process.env.NON_EXISTING_USERNAME;
  var username = process.env.USERNAME;
  var password = process.env.PASSWORD;

  (0, _mocha.it)('should be defined and return false if parameter is not valid', function () {
    _chai.assert.ok(_auth.check);
    _chai.assert.ok(!(0, _auth.check)());
  });

  (0, _mocha.it)('should return a Promise if login parameter is given', function () {
    _chai.assert.ok((0, _auth.check)({ login: username, password: password }) instanceof Promise);
  });

  (0, _mocha.it)('should resolve to an object with playerme_session if valid', function (done) {
    (0, _auth.check)({ login: username, password: password }).then(function (user) {
      _chai.assert.typeOf(user, 'object');
      _chai.assert.ok(user.id);
      _chai.assert.equal(user.username, username);
      _chai.assert.ok(user.playerme_session);
      done();
    }).catch(function () {
      done(new Error('env username and or password is incorrect'));
    });
  });

  (0, _mocha.it)('should reject with an error if not valid', function (done) {
    (0, _auth.check)({ login: nonExistingUsername, password: password }).then(function () {
      done(new Error('env non-existing user exists'));
    }).catch(function (error) {
      _chai.assert.ok(error.message);
      done();
    });
  });
});