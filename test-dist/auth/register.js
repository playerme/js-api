'use strict';

var _mocha = require('mocha');

var _chai = require('chai');

var _utils = require('../lib/utils');

var _auth = require('../../dist/auth');

(0, _mocha.describe)('auth.register', function () {
  var existingUsername = process.env.USERNAME;
  var email = process.env.REGISTER_EMAIL;
  var username = process.env.REGISTER_USERNAME;
  var password = process.env.REGISTER_PASSWORD;
  var confirm = password;

  (0, _mocha.it)('should be defined,\n        return a Promise,\n        and fail if arguments are not valid', function (done) {
    _chai.assert.ok(_auth.register);
    _chai.assert.typeOf((0, _auth.register)(), 'Promise');
    (0, _utils.shouldFail)((0, _auth.register)(), done);
  });

  (0, _mocha.it)('should fail if username already exists', function (done) {
    return (0, _utils.shouldFail)((0, _auth.register)({ email: email, username: existingUsername, password: password, confirm: confirm }), done);
  });

  (0, _mocha.it)('should fail if username exceeds 20 characters', function (done) {
    return (0, _utils.shouldFail)((0, _auth.register)({
      email: email, username: '123456789012345678901', password: password, confirm: confirm
    }), done);
  });

  (0, _mocha.it)('should fail if username is below 3 characters', function (done) {
    return (0, _utils.shouldFail)((0, _auth.register)({
      email: email, username: '12', password: password, confirm: confirm
    }), done);
  });

  (0, _mocha.it)('should fail if username has invalid characters', function (done) {
    return (0, _utils.shouldFail)((0, _auth.register)({ email: email, username: '?*#%', password: password, confirm: confirm }), done);
  });

  (0, _mocha.it)('should fail if password has less than 8 characters', function (done) {
    return (0, _utils.shouldFail)((0, _auth.register)({ email: email, username: username, password: '1234567', confirm: confirm }), done);
  });

  (0, _mocha.it)('should fail if confirm is not the same as password', function (done) {
    return (0, _utils.shouldFail)((0, _auth.register)({ email: email, username: username, password: password, confirm: confirm + 1 }), done);
  });

  (0, _mocha.it)('should fail if email is invalid', function (done) {
    return (0, _utils.shouldFail)((0, _auth.register)({ email: 'invalid email', username: username, password: password, confirm: confirm }), done);
  });

  (0, _mocha.it)('should resolve with a success message\n        if registration is successful', function (done) {
    return (0, _utils.shouldSucceed)((0, _auth.register)({ email: email, username: username, password: password, confirm: confirm }), function (success) {
      _chai.assert.ok(success.message);
    }, done);
  });
});