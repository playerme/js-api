import { describe, it } from 'mocha';
import { assert } from 'chai';
import { shouldFail, shouldSucceed } from '../lib/utils';

import { prelogin } from '../../dist/auth';

describe('auth.prelogin', () => {
  const nonExistingUsername = process.env.NON_EXISTING_USERNAME;
  const username = process.env.USERNAME;

  it(
    `should be defined,
        return a Promise,
        and fail if arguments are not valid`,
    done => {
      assert.ok(prelogin);
      assert.typeOf(prelogin(), 'Promise');
      shouldFail(prelogin(), done);
    }
  );

  it(
    `should fail if user does not exist`,
    done => shouldFail(
      prelogin({ login: nonExistingUsername }), done
    )
  );

  it(
    `should resolve to a user object if successful`,
    done => shouldSucceed(
      prelogin({ login: username }),
      user => {
        assert.typeOf(user, 'object');
        assert.ok(user.id);
        assert.equal(user.username, username);
      },
      done
    )
  );
});
