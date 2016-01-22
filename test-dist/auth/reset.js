'use strict';

var _mocha = require('mocha');

var _chai = require('chai');

var _utils = require('../lib/utils');

var _auth = require('../../dist/auth');

(0, _mocha.describe)('auth.reset', function () {
  var code = process.env.RESET_CODE;
  var password = process.env.PASSWORD;
  var confirm = password;

  (0, _mocha.it)('should be defined,\n        returns a Promise,\n        and reject if arguments are not valid', function (done) {
    _chai.assert.ok(_auth.reset);
    _chai.assert.typeOf((0, _auth.reset)(), 'Promise');
    (0, _utils.shouldFail)((0, _auth.reset)(), done);
  });

  (0, _mocha.it)('should fail if code is invalid', function (done) {
    return (0, _utils.shouldFail)((0, _auth.reset)({ code: 'invalidcode', password: password, confirm: confirm }), done);
  });

  (0, _mocha.it)('should fail if password and confirm are not the same', function (done) {
    return (0, _utils.shouldFail)((0, _auth.reset)({ code: code, password: password, confirm: confirm + 1 }), done);
  });

  if (!code) return; // skip the tests below if there is no valid code

  (0, _mocha.it)('should resolve with a success message if successful', function (done) {
    return (0, _utils.shouldSucceed)((0, _auth.reset)({ code: code, password: password, confirm: confirm }), function (success) {
      return _chai.assert.ok(success.message);
    }, done);
  });
});