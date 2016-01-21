import { describe, it } from 'mocha';
import { assert } from 'chai';
import { shouldFail, shouldSucceed } from '../lib/utils';

import { reset } from '../../dist/auth';

describe('auth.reset', () => {
  const code = process.env.RESET_CODE;
  const password = process.env.PASSWORD;
  const confirm = password;

  it(
    `should be defined,
        returns a Promise,
        and reject if arguments are not valid`,
    done => {
      assert.ok(reset);
      assert.typeOf(reset(), 'Promise');
      shouldFail(reset(), done);
    }
  );

  it(
    `should fail if code is invalid`,
    done => shouldFail(
      reset({ code: 'invalidcode', password, confirm }),
      done
    )
  );

  it(
    `should fail if password and confirm are not the same`,
    done => shouldFail(
      reset({ code, password, confirm: confirm + 1 }),
      done
    )
  );

  if (!code) return; // skip the tests below if there is no valid code

  it(
    `should resolve with a success message if successful`,
    done => shouldSucceed(
      reset({ code, password, confirm }),
      success => assert.ok(success.message),
      done
    )
  );
});
