import { describe, it } from 'mocha';
import { assert } from 'chai';

import { prelogin } from '../../dist/auth';

describe('auth.prelogin', () => {
  const nonExistingUsername = process.env.NON_EXISTING_USERNAME;
  const username = process.env.USERNAME;

  it('should be defined and return false if parameter is not valid', () => {
    assert.ok(prelogin);
    assert.ok(!prelogin());
  });

  it('should return a Promise if login parameter is given', () => {
    assert.ok(prelogin({ login: username }) instanceof Promise);
  });

  it('should resolve to an object if user exists', (done) => {
    prelogin({ login: username })
      .then((user) => {
        assert.typeOf(user, 'object');
        assert.ok(user.id);
        assert.equal(user.username, username);
        done();
      })
    .catch(() => {
      done(new Error('env user does not exist'));
    });
  });

  it('should reject with an error if user does not exist', (done) => {
    prelogin({ login: nonExistingUsername })
      .then(() => {
        done(new Error('env non-existing user exists'));
      }).catch((error) => {
        assert.ok(error.message);
        done();
      });
  });
});
