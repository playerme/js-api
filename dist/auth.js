'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prelogin = prelogin;

var _fetch = require('./lib/fetch');

function prelogin(_ref) {
  var login = _ref.login;

  return new Promise(function (resolve, reject) {
    (0, _fetch.post)('auth/pre-login', { login: login }).then(function (response) {
      if (response.success) {
        return resolve(response.results);
      }

      return reject({ message: response.results });
    });
  });
}