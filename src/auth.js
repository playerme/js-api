import { post } from './lib/fetch';

export function prelogin({ login }) {
  return new Promise((resolve, reject) => {
    post('auth/pre-login', { login })
      .then((response) => {
        if (response.success) {
          return resolve(response.results);
        }

        return reject({ message: response.results });
      });
  });
}
