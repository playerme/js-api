'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = _fetch;
exports.get = get;
exports.post = post;
exports.postProcess = postProcess;
var stockFetch = undefined;

if (typeof fetch !== 'undefined') {
  stockFetch = fetch;
} else {
  stockFetch = require('isomorphic-fetch');
}

var JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

var BASE_URL = process.env.BASE_URL || 'https://player.me/api/v1';

function _fetch(endpoint) {
  var config = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var baseURL = config.baseURL || BASE_URL;

  var additionalHeaders = {};
  var cookie = config.cookie;

  if (cookie) {
    additionalHeaders.Cookie = cookie;
  }

  var headers = _extends({}, JSON_HEADERS, additionalHeaders);

  return stockFetch(baseURL + '/' + endpoint, _extends({
    headers: headers,
    method: 'GET'
  }, config));
}

function _serialize() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  var query = [];

  for (var key in args) {
    if (args.hasOwnProperty(key)) {
      var name = encodeURIComponent(key);
      var value = encodeURIComponent(args[key]);
      query.push(name + '=' + value);
    }
  }

  return query.join('&');
}

function get(endpoint, args) {
  var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  var queryString = _serialize(args);

  return _fetch(endpoint + (queryString ? '?' + queryString : ''), _extends({ method: 'GET' }, config));
}

function post(endpoint, args) {
  var config = arguments.length <= 2 || arguments[2] === undefined ? {} : arguments[2];

  return _fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(args),
    baseURL: config.baseURL
  });
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