import { describe, it } from 'mocha';
import { assert } from 'chai';
import { shouldFail, shouldSucceed } from '../lib/utils';

import { forgot } from '../../dist/auth';

describe('auth.forgot', () => {
  const nonExistingUsername = process.env.NON_EXISTING_USERNAME;
  const username = process.env.USERNAME;

  it(
    `should be defined,
        return a Promise,
        and fail if arguments are not valid`,
    done => {
      assert.ok(forgot);
      assert.typeOf(forgot(), 'Promise');
      shouldFail(forgot(), done);
    }
  );

  it(
    `should fail if user does not exist`,
    done => shouldFail(
      forgot({ username: nonExistingUsername }),
      done
    )
  );

  it(
    `should resolve with a success message if user exists`,
    done => shouldSucceed(
      forgot({ username }),
      success => assert.ok(success.message),
      done
    )
  );
});
