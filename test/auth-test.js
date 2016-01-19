import { describe, it } from 'mocha';
import { assert } from 'chai';

import { prelogin } from '../dist/auth';

describe('auth tests', () => {
  const username = process.env.USERNAME;

  it('prelogin', (done) => {
    prelogin({ login: username })
      .then((user) => {
        assert.typeOf(user, 'object');
        assert.ok(user.id, 'user has an id');
        assert.equal(user.username, username, 'username is equal to env username');
        done();
      }).catch(() => {
        done(new Error('env user does not exist'));
      });
  });
});
