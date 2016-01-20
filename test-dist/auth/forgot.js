'use strict';

var _mocha = require('mocha');

var _chai = require('chai');

var _auth = require('../../dist/auth');

(0, _mocha.describe)('auth.forgot', function () {
  var nonExistingUsername = process.env.NON_EXISTING_USERNAME;
  var username = process.env.USERNAME;

  (0, _mocha.it)('should be defined and return false if parameter is not valid', function () {
    _chai.assert.ok(_auth.forgot);
    _chai.assert.ok(!(0, _auth.forgot)());
  });

  (0, _mocha.it)('should resolve if user exists', function (done) {
    var promise = (0, _auth.forgot)({ username: username });
    _chai.assert.typeOf(promise, 'Promise');

    promise.then(function (success) {
      _chai.assert.isTrue(success);
      done();
    }).catch(function () {
      done(new Error('env user does not exist'));
    });
  });

  (0, _mocha.it)('should reject with an error if user does not exist', function (done) {
    (0, _auth.forgot)({ username: nonExistingUsername }).then(function () {
      done(new Error('env non-existing user exists'));
    }).catch(function (error) {
      _chai.assert.ok(error.message);
      done();
    });
  });
});