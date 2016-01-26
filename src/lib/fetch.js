let stockFetch;

if (typeof fetch !== 'undefined') {
  stockFetch = fetch;
} else {
  stockFetch = require('isomorphic-fetch');
}

const JSON_HEADERS = {
  Accept: 'application/json',
  'Content-Type': 'application/json'
};

const BASE_URL = process.env.BASE_URL || 'https://player.me/api/v1';

export default function _fetch(endpoint, config = {}) {
  const baseURL = config.baseURL || BASE_URL;

  return stockFetch(
    `${baseURL}/${endpoint}`, {
      headers: JSON_HEADERS,
      method: 'GET',
      ...config
    }
  );
}

export function post(endpoint, args, config = {}) {
  return _fetch(endpoint, {
    method: 'POST',
    body: JSON.stringify(args),
    baseURL: config.baseURL
  });
}

export function postProcess(response) {
  const processJSON = (responseJSON) => {
    if (responseJSON.success) {
      return Promise.resolve(responseJSON.results || true);
    }

    return Promise.reject({ message: responseJSON.results });
  };

  if (typeof response.json === 'function') {
    return response.json().then(processJSON);
  }

  return Promise.resolve(response).then(processJSON);
}
