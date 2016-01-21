import { describe, it } from 'mocha';
import { assert } from 'chai';
import { shouldFail, shouldSucceed } from '../lib/utils';

import { register } from '../../dist/auth';

describe('auth.register', () => {
  const existingUsername = process.env.USERNAME;
  const email = process.env.REGISTER_EMAIL;
  const username = process.env.REGISTER_USERNAME;
  const password = process.env.REGISTER_PASSWORD;
  const confirm = password;

  it(
    `should be defined,
        return a Promise,
        and fail if arguments are not valid`,
    done => {
      assert.ok(register);
      assert.typeOf(register(), 'Promise');
      shouldFail(register(), done);
    }
  );

  it(
    `should fail if username already exists`,
    done => shouldFail(
      register({ email, username: existingUsername, password, confirm }),
      done
    )
  );

  it(
    `should fail if username exceeds 20 characters`,
    done => shouldFail(
      register({
        email, username: '123456789012345678901', password, confirm
      }),
      done
    )
  );

  it(
    `should fail if username is below 3 characters`,
    done => shouldFail(
      register({
        email, username: '12', password, confirm
      }),
      done
    )
  );

  it(
    `should fail if username has invalid characters`,
    done => shouldFail(
      register({ email, username: '?*#%', password, confirm }),
      done
    )
  );

  it(
    `should fail if password has less than 8 characters`,
    done => shouldFail(
      register({ email, username, password: '1234567', confirm }),
      done
    )
  );

  it(
    `should fail if confirm is not the same as password`,
    done => shouldFail(
      register({ email, username, password, confirm: confirm + 1 }),
      done
    )
  );

  it(
    `should fail if email is invalid`,
    done => shouldFail(
      register({ email: 'invalid email', username, password, confirm }),
      done
    )
  );

  it(
    `should resolve with a success message
        if registration is successful`,
    done => shouldSucceed(
      register({ email, username, password, confirm }),
      success => {
        assert.ok(success.message);
      },
      done
    )
  );
});
