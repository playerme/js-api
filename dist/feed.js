'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.browse = browse;

var _fetch = require('./lib/fetch');

function browse() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  return (0, _fetch.get)('feed', args, config).then(function (response) {
    return response.json();
  }).then(function (responseJSON) {
    return Promise.resolve({
      success: responseJSON.success,
      results: responseJSON
    });
  }).then(_fetch.postProcess);
}