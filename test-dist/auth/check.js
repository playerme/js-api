'use strict';

require('./reset');

var _mocha = require('mocha');

var _chai = require('chai');

var _utils = require('../lib/utils');

var _auth = require('../../dist/auth');

(0, _mocha.describe)('auth.check', function () {
  var nonExistingUsername = process.env.NON_EXISTING_USERNAME;
  var login = process.env.USERNAME;
  var password = process.env.PASSWORD;

  (0, _mocha.it)('should be defined,\n        return a Promise,\n        and fail if arguments are not valid', function (done) {
    _chai.assert.ok(_auth.check);
    _chai.assert.typeOf((0, _auth.check)(), 'Promise');
    (0, _utils.shouldFail)((0, _auth.check)(), done);
  });

  (0, _mocha.it)('should fail if username does not exist', function (done) {
    return (0, _utils.shouldFail)((0, _auth.check)({ login: nonExistingUsername, password: password }), done);
  });

  (0, _mocha.it)('should resolve to a user object\n        { id, username, playerme_session }\n        if successful', function (done) {
    return (0, _utils.shouldSucceed)((0, _auth.check)({ login: login, password: password }), function (user) {
      _chai.assert.typeOf(user, 'object');
      _chai.assert.ok(user.id);
      _chai.assert.equal(user.username, login);
      _chai.assert.ok(user.playerme_session);
    }, done);
  });
});