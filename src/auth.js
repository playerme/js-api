import { post } from './lib/fetch';

export function prelogin(args = {}) {
  if (!args.login) return false;

  const { login } = args;

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
