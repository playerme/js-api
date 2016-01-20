import { describe, it } from 'mocha';
import { assert } from 'chai';

import { forgot } from '../../dist/auth';

describe('auth.forgot', () => {
  const nonExistingUsername = process.env.NON_EXISTING_USERNAME;
  const username = process.env.USERNAME;

  it('should be defined and return false if parameter is not valid', () => {
    assert.ok(forgot);
    assert.ok(!forgot());
  });

  it('should resolve if user exists', (done) => {
    const promise = forgot({ username });
    assert.typeOf(promise, 'Promise');

    promise
      .then((success) => {
        assert.isTrue(success);
        done();
      })
    .catch(() => {
      done(new Error('env user does not exist'));
    });
  });

  it('should reject with an error if user does not exist', (done) => {
    forgot({ username: nonExistingUsername })
      .then(() => {
        done(new Error('env non-existing user exists'));
      }).catch((error) => {
        assert.ok(error.message);
        done();
      });
  });
});
