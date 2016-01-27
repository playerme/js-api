import { describe, it } from 'mocha';
import { assert } from 'chai';
import { shouldFail, shouldSucceed } from '../lib/utils';

import { feed } from '../../dist';
const { browse } = feed;

describe('feed.browse', () => {
  const cookie = process.env.COOKIE;

  it(
    `should be defined,
        return a Promise,
        and fail if no authenticated`,
    done => {
      assert.ok(browse);
      assert.typeOf(browse(), 'Promise');
      shouldFail(browse(), done);
    }
  );

  it(
    `should succeed if authenticated`,
    done => {
      shouldSucceed(
        browse({}, { cookie }),
        feeds => {
          assert.isArray(feeds);
        },
        done
      );
    }
  );
});
