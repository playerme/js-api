import { describe, it } from 'mocha';
import { assert } from 'chai';

import { check } from '../../dist/auth';

describe('auth.check', () => {
  const nonExistingUsername = process.env.NON_EXISTING_USERNAME;
  const username = process.env.USERNAME;
  const password = process.env.PASSWORD;

  it('should be defined and return false if parameter is not valid', () => {
    assert.ok(check);
    assert.ok(!check());
  });

  it('should resolve to an object with playerme_session if valid', (done) => {
    const promise = check({ login: username, password });
    assert.typeOf(promise, 'Promise');

    promise
      .then((user) => {
        assert.typeOf(user, 'object');
        assert.ok(user.id);
        assert.equal(user.username, username);
        assert.ok(user.playerme_session);
        done();
      })
    .catch(() => {
      done(new Error('env username and or password is incorrect'));
    });
  });

  it('should reject with an error if not valid', (done) => {
    check({ login: nonExistingUsername, password })
      .then(() => {
        done(new Error('env non-existing user exists'));
      }).catch((error) => {
        assert.ok(error.message);
        done();
      });
  });
});
