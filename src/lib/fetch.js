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
  ).then(response => response.json());
}

export function post(endpoint, args) {
  return fetch(endpoint, { method: 'POST', body: JSON.stringify(args) });
}
