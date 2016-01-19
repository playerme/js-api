'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prelogin = prelogin;
exports.check = check;

var _fetch = require('./lib/fetch');

var _cookie = require('cookie');

var _cookie2 = _interopRequireDefault(_cookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function prelogin() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var login = args.login;

  if (!login) return false;

  return new Promise(function (resolve, reject) {
    (0, _fetch.post)('auth/pre-login', { login: login }).then(function (response) {
      return response.json();
    }).then(function (response) {
      if (response.success) {
        return resolve(response.results);
      }

      return reject({ message: response.results });
    });
  });
}

function check() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var login = args.login;
  var password = args.password;

  if (!login || !password) return false;

  return new Promise(function (resolve, reject) {
    var playermeSession = undefined;

    (0, _fetch.post)('auth/login', { login: login, password: password }).then(function (response) {
      var cookies = _cookie2.default.parse(response.headers.get('set-cookie'));

      // get subdomain
      var matched = /^https?:\/\/([^\.]+)\./.exec(response.url);
      var sessionName = 'playerme_session';

      if (matched) {
        var subdomain = matched[1];
        sessionName = subdomain + '_' + sessionName;
      }

      playermeSession = cookies[sessionName];

      return response.json();
    }).then(function (response) {
      if (response.success) {
        var results = _extends({
          playerme_session: playermeSession
        }, response.results);

        return resolve(results);
      }

      return reject({ message: response.results });
    });
  });
}