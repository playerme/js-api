'use strict';

var _mocha = require('mocha');

var _chai = require('chai');

var _utils = require('../lib/utils');

var _dist = require('../../dist');

var browse = _dist.feed.browse;

(0, _mocha.describe)('feed.browse', function () {
  var cookie = process.env.COOKIE;

  (0, _mocha.it)('should be defined,\n        return a Promise,\n        and fail if no authenticated', function (done) {
    _chai.assert.ok(browse);
    _chai.assert.typeOf(browse(), 'Promise');
    (0, _utils.shouldFail)(browse(), done);
  });

  (0, _mocha.it)('should succeed if authenticated', function (done) {
    (0, _utils.shouldSucceed)(browse({}, { cookie: cookie }), function (feeds) {
      _chai.assert.isArray(feeds);
    }, done);
  });
});