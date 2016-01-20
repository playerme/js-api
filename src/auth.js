import { post, postProcess } from './lib/fetch';
import Cookie from 'cookie';

export function prelogin(args = {}) {
  const { login } = args;

  if (!login) return false;

  return post('auth/pre-login', { login }).then(postProcess);
}

export function check(args = {}) {
  const { login, password } = args;

  if (!login || !password) return false;

  return post('auth/login', { login, password })
    .then((response) => {
      const cookies = Cookie.parse(response.headers.get('set-cookie'));

      // get subdomain / environemnt
      const matched = /^https?:\/\/([^\.]+)\./.exec(response.url);
      let sessionName = 'playerme_session';

      if (matched) {
        const subdomain = matched[1];
        sessionName = `${subdomain}_${sessionName}`;
      }

      const playermeSession = cookies[sessionName];

      return response.json().then((responseJSON) => {
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
