'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prelogin = prelogin;

var _fetch = require('./lib/fetch');

function prelogin() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

  if (!args.login) return false;

  var login = args.login;

  return new Promise(function (resolve, reject) {
    (0, _fetch.post)('auth/pre-login', { login: login }).then(function (response) {
      if (response.success) {
        return resolve(response.results);
      }

      return reject({ message: response.results });
    });
  });
}