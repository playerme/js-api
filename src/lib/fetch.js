import _fetch from 'isomorphic-fetch';

const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

const BASE_URL = process.env.BASE_URL || 'https://player.me/api/v1';

export default function fetch(endpoint, config = {}) {
  const url = `${BASE_URL}/${endpoint}`;

  return _fetch(
    url, {
      headers: JSON_HEADERS,
      method: 'GET',
      ...config
    }
  );
}

export function post(endpoint, args) {
  return fetch(endpoint, { method: 'POST', body: JSON.stringify(args) });
}

export function postProcess(response) {
  const processJSON = (responseJSON) => {
    if (responseJSON.success) {
      return Promise.resolve(responseJSON.results);
    }

    return Promise.reject({ message: responseJSON.results });
  };

  if (typeof response.json === 'function') {
    return response.json().then(processJSON);
  }

  return Promise.resolve(response).then(processJSON);
}
