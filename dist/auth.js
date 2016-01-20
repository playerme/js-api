'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prelogin = prelogin;
exports.check = check;
exports.forgot = forgot;

var _fetch = require('./lib/fetch');

var _cookie = require('cookie');

var _cookie2 = _interopRequireDefault(_cookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prelogin() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var login = args.login;

  if (!login) return false;

  return (0, _fetch.post)('auth/pre-login', { login: login }).then(_fetch.postProcess);
}

function check() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var login = args.login;
  var password = args.password;

  if (!login || !password) return false;

  return (0, _fetch.post)('auth/login', { login: login, password: password }).then(function (response) {
    var cookies = _cookie2.default.parse(response.headers.get('set-cookie'));

    // get subdomain / environemnt
    var matched = /^https?:\/\/([^\.]+)\./.exec(response.url);
    var sessionName = 'playerme_session';

    if (matched) {
      var subdomain = matched[1];
      sessionName = subdomain + '_' + sessionName;
    }

    var playermeSession = cookies[sessionName];

    return response.json().then(function (responseJSON) {
      // inject session key into response result
      var resultWithSessionKey = _extends({}, responseJSON, {
        results: _extends({}, responseJSON.results, {
          playerme_session: playermeSession
        })
      });

      return Promise.resolve(resultWithSessionKey);
    });
  }).then(_fetch.postProcess);
}

function forgot() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var username = args.username;

  if (!username) return false;

  return (0, _fetch.post)('auth/forgot', { username: username }).then(function (response) {
    return Promise.resolve(response);
  }).then(_fetch.postProcess);
}