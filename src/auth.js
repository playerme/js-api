import { post, postProcess } from './lib/fetch';
import error from './lib/error';

import Cookie from 'cookie';

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
export function prelogin(args = {}) {
  const { login } = args;

  if (!login) {
    return Promise.reject({ message: error.INVALID_ARGUMENTS });
  }

  return post('auth/pre-login', { login }).then(postProcess);
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
export function check(args = {}) {
  const { login, password } = args;

  if (!login || !password) {
    return Promise.reject({ message: error.INVALID_ARGUMENTS });
  }

  return post('auth/login', { login, password })
    .then(response => {
      const cookies = Cookie.parse(response.headers.get('set-cookie'));

      // get subdomain / environemnt
      const matched = /^https?:\/\/([^\.]+)\./.exec(response.url);
      let sessionName = 'playerme_session';

      if (matched) {
        const subdomain = matched[1];
        sessionName = `${subdomain}_${sessionName}`;
      }

      const playermeSession = cookies[sessionName];

      return response.json().then(responseJSON => {
        // inject session key into response result
        const resultWithSessionKey = {
          ...responseJSON,
          results: {
            ...responseJSON.results,
            playerme_session: playermeSession
          }
        };

        return Promise.resolve(resultWithSessionKey);
      });
    })
    .then(postProcess);
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
export function forgot(args = {}) {
  const { username } = args;

  if (!username) {
    return Promise.reject({ message: error.INVALID_ARGUMENTS });
  }

  return post('auth/forgot', { username })
    .then(postProcess)
    .then(() => Promise.resolve({ message: 'Successful!' }));
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
export function register(args = {}) {
  const { username, email, password, confirm } = args;

  if (!(username && email && password && confirm)) {
    return Promise.reject({ message: error.INVALID_ARGUMENTS });
  }

  if (password !== confirm) {
    return Promise.reject({ message: error.PASSWORD_CONFIRM_NOT_MATCHED });
  }

  return post('auth/register', { username, email, password, confirm })
    .then(postProcess)
    .then(message => Promise.resolve({ message }));
}
