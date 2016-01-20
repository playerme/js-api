'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = fetch;
exports.post = post;
exports.postProcess = postProcess;

var _isomorphicFetch = require('isomorphic-fetch');

var _isomorphicFetch2 = _interopRequireDefault(_isomorphicFetch);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

var BASE_URL = process.env.BASE_URL || 'https://player.me/api/v1';

function fetch(endpoint) {
  var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var url = BASE_URL + '/' + endpoint;

  return (0, _isomorphicFetch2.default)(url, _extends({
    headers: JSON_HEADERS,
    method: 'GET'
  }, config));
}

function post(endpoint, args) {
  return fetch(endpoint, { method: 'POST', body: JSON.stringify(args) });
}

function postProcess(response) {
  var processJSON = function processJSON(responseJSON) {
    if (responseJSON.success) {
      return Promise.resolve(responseJSON.results || true);
    }

    return Promise.reject({ message: responseJSON.results });
  };

  if (typeof response.json === 'function') {
    return response.json().then(processJSON);
  }

  return Promise.resolve(response).then(processJSON);
}