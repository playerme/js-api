import './reset';

import { describe, it } from 'mocha';
import { assert } from 'chai';
import { shouldFail, shouldSucceed } from '../lib/utils';

import { check } from '../../dist/auth';

describe('auth.check', () => {
  const nonExistingUsername = process.env.NON_EXISTING_USERNAME;
  const login = process.env.USERNAME;
  const password = process.env.PASSWORD;

  it(
    `should be defined,
        return a Promise,
        and fail if arguments are not valid`,
    done => {
      assert.ok(check);
      assert.typeOf(check(), 'Promise');
      shouldFail(check(), done);
    }
  );

  it(
    `should fail if username does not exist`,
    done => shouldFail(check({ login: nonExistingUsername, password }), done)
  );

  it(
    `should resolve to a user object
        { id, username, playerme_session }
        if successful`,
    done => shouldSucceed(
      check({ login, password }),
      user => {
        assert.typeOf(user, 'object');
        assert.ok(user.id);
        assert.equal(user.username, login);
        assert.ok(user.cookie);
      },
      done
    )
  );
});
