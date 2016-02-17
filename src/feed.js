import { get, postProcess } from './lib/fetch';

export function browse(args = {}, config = {}) {
  return get('feed', args, config)
    .then(response => response.json())
    .then(responseJSON => Promise.resolve({
      success: responseJSON.success,
      results: responseJSON
    }))
    .then(postProcess);
}
