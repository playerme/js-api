'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.prelogin = prelogin;
exports.check = check;
exports.forgot = forgot;
exports.register = register;
exports.reset = reset;

var _fetch = require('./lib/fetch');

var _error = require('./lib/error');

var _error2 = _interopRequireDefault(_error);

var _cookie = require('cookie');

var _cookie2 = _interopRequireDefault(_cookie);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * @module auth
 *
 * @example
 * import { auth } from 'playerme-js-api'
 */

/**
 * This is useful if you want to separate login into 2 steps.
 * It only requires an email or username, and if it exists,
 * it'll return a user object. You will still need to send a normal
 * login after this request to do the real login,
 * this is merely a "search by email/username".
 * Please note that this is heavily rate limited for security purposes.
 *
 * @param     {Object}  args
 * @param     {String}  args.login  The login (username OR email)
 *
 * @return    {Promise<Object>}     Resolves to user information
 *
 * @example
 * auth
 *   .prelogin({ login: '<login>' })
 *   .then((user) => user)
 *   .catch((error) => error.message)
 */
function prelogin() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var login = args.login;

  if (!login) {
    return Promise.reject({ message: _error2.default.INVALID_ARGUMENTS });
  }

  return (0, _fetch.post)('auth/pre-login', { login: login }).then(_fetch.postProcess);
}

/**
 * This method of login is the regular one,
 * also used in the official front-end app.
 * This will return a cookie named <code>playerme_session</code>,
 * make sure you keep that cookie and send it on consequent requests.
 *
 * @param     {Object}  args
 * @param     {String}  args.login      The login (username OR email)
 * @param     {String}  args.password   The password
 *
 * @return    {Promise<Object>}         Resolves to user information
 *
 * @example
 * auth
 *   .check({ login: '<login>', password: '<password>' })
 *   .then((user) => user)
 *   .catch((error) => error.message)
 */
function check() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var login = args.login;
  var password = args.password;

  if (!login || !password) {
    return Promise.reject({ message: _error2.default.INVALID_ARGUMENTS });
  }

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

/**
 * Request a reset link. This will send a code to the user's email.
 *
 * @param   {Object}  args
 * @param   {String}  args.username   The username
 *
 * @return  {Promise<Boolean>}  Resolves to <code>true</code> if successful
 *
 * @example
 * auth
 *   .forgot({ username: '<username>' })
 *   .then((success) => success)
 *   .catch((error) => error.message)
 */
function forgot() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var username = args.username;

  if (!username) {
    return Promise.reject({ message: _error2.default.INVALID_ARGUMENTS });
  }

  return (0, _fetch.post)('auth/forgot', { username: username }).then(_fetch.postProcess).then(function () {
    return Promise.resolve({ message: 'Successful!' });
  });
}

/**
 * Register a new user
 *
 * @param   {Object}    args
 * @param   {String}    username    The username (min: 3, max: 20, regex: [a-zA-Z0-9_-]+$)
 * @param   {String}    email       The email
 * @param   {String}    password    The password (min: 8)
 * @param   {String}    confirm     This should be the same as password
 *
 * @return  {Promise<Object>}   Resolves to a success message
 *
 * @example
 * auth
 *   .register({
 *     email: '<email>',
 *     username: '<username>',
 *     password: '<password>',
 *     confirm: '<confirm>'
 *   })
 *   .then((success) => success.message)
 *   .catch((error) => error.message)
 */
function register() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var username = args.username;
  var email = args.email;
  var password = args.password;
  var confirm = args.confirm;

  if (!(username && email && password && confirm)) {
    return Promise.reject({ message: _error2.default.INVALID_ARGUMENTS });
  }

  if (password !== confirm) {
    return Promise.reject({ message: _error2.default.PASSWORD_CONFIRM_NOT_MATCHED });
  }

  return (0, _fetch.post)('auth/register', { username: username, email: email, password: password, confirm: confirm }).then(_fetch.postProcess).then(function (message) {
    return Promise.resolve({ message: message });
  });
}

/**
 * Resets the password
 *
 * @param   {Object}    args
 * @param   {String}    args.code       Password reset code
 * @param   {String}    args.password   The password (min: 8)
 * @param   {String}    args.confirm    This should be the same as password
 *
 * @return  {Promise<Boolean>}   Resolves <code>true</code> if successful
 *
 * @example
 * auth
 *   .reset({ code: '<code>', password: '<password>', confirm: '<confirm>' })
 *   .then((success) => success)
 *   .catch((error) => error.message)
 */
function reset() {
  var args = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
  var code = args.code;
  var password = args.password;
  var confirm = args.confirm;

  if (!(code && password && confirm)) {
    return Promise.reject({ message: _error2.default.INVALID_ARGUMENTS });
  }

  if (password !== confirm) {
    return Promise.reject({ message: _error2.default.PASSWORD_CONFIRM_NOT_MATCHED });
  }

  return (0, _fetch.post)('auth/reset/' + code, { password: password, confirm: confirm }).then(_fetch.postProcess).then(function () {
    return Promise.resolve({ message: 'Successful!' });
  });
}