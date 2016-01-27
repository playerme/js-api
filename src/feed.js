import { get, postProcess } from './lib/fetch';

export function browse(args = {}, config = {}) {
  return get('feed', args, config)
    .then(postProcess);
}
