import { post } from './lib/fetch';
import Cookie from 'cookie';

export function prelogin(args = {}) {
  const { login } = args;

  if (!login) return false;

  return new Promise((resolve, reject) => {
    post('auth/pre-login', { login })
      .then(response => response.json())
      .then((response) => {
        if (response.success) {
          return resolve(response.results);
        }

        return reject({ message: response.results });
      });
  });
}

export function check(args = {}) {
  const { login, password } = args;

  if (!login || !password) return false;

  return new Promise((resolve, reject) => {
    let playermeSession;

    post('auth/login', { login, password })
      .then((response) => {
        const cookies = Cookie.parse(response.headers.get('set-cookie'));

        // get subdomain
        const matched = /^https?:\/\/([^\.]+)\./.exec(response.url);
        let sessionName = 'playerme_session';

        if (matched) {
          const subdomain = matched[1];
          sessionName = `${subdomain}_${sessionName}`;
        }

        playermeSession = cookies[sessionName];

        return response.json();
      }).then((response) => {
        if (response.success) {
          const results = {
            playerme_session: playermeSession,
            ...response.results
          };

          return resolve(results);
        }

        return reject({ message: response.results });
      });
  });
}
