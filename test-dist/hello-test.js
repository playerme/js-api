'use strict';

var _mocha = require('mocha');

var _chai = require('chai');

var _dist = require('../dist');

(0, _mocha.describe)('hello tests', function () {
  (0, _mocha.it)('message', function () {
    (0, _chai.expect)((0, _dist.hello)()).to.equal('Hello from Player.me!');
  });
});