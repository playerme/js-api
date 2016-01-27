'use strict';

var _mocha = require('mocha');

var _chai = require('chai');

var _utils = require('../lib/utils');

var _feed = require('../../dist/feed');

(0, _mocha.describe)('feed.browse', function () {
  var cookie = process.env.COOKIE;

  (0, _mocha.it)('should be defined,\n        return a Promise,\n        and fail if no authenticated', function (done) {
    _chai.assert.ok(_feed.browse);
    _chai.assert.typeOf((0, _feed.browse)(), 'Promise');
    (0, _utils.shouldFail)((0, _feed.browse)(), done);
  });

  (0, _mocha.it)('should succeed if authenticated', function (done) {
    (0, _utils.shouldSucceed)((0, _feed.browse)({}, { cookie: cookie }), function (feeds) {
      _chai.assert.isArray(feeds);
    }, done);
  });
});