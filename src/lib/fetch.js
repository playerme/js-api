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

  const additionalHeaders = {};
  const { cookie } = config;
  if (cookie) {
    additionalHeaders.Cookie = cookie;
  }

  const headers = {
    ...JSON_HEADERS,
    ...additionalHeaders
  };

  return stockFetch(
    `${baseURL}/${endpoint}`, {
      headers,
      method: 'GET',
      ...config
    }
  );
}

function _serialize(args = {}) {
  const query = [];

  for (const key in args) {
    if (args.hasOwnProperty(key)) {
      const name = encodeURIComponent(key);
      const value = encodeURIComponent(args[key]);
      query.push(`${name}=${value}`);
    }
  }

  return query.join('&');
}

export function get(endpoint, args, config = {}) {
  const queryString = _serialize(args);

  return _fetch(
    endpoint + (queryString ? '?' + queryString : ''),
    { method: 'GET', ...config }
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
