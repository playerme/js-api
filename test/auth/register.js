import { describe, it } from 'mocha';
import { assert } from 'chai';

import { register } from '../../dist/auth';

describe('auth.register', () => {
  const existingUsername = process.env.USERNAME;
  const email = process.env.REGISTER_EMAIL;
  const username = process.env.REGISTER_USERNAME;
  const password = process.env.REGISTER_PASSWORD;
  const confirm = password;

  it(
    'should be defined and return false if parameter is not valid',
    () => {
      assert.ok(register);
      assert.ok(!register());
    }
  );

  const shouldFail = (args, done) => {
    const promise = register(args);
    assert.typeOf(promise, 'Promise');

    promise
      .then((success) => {
        done(new Error(success.message));
      })
      .catch((error) => {
        assert.ok(error.message);
        done();
      });
  };

  it(
    'should fail if username already exists',
    (done) => {
      shouldFail({
        email, username: existingUsername, password, confirm
      }, done);
    }
  );

  it(
    'should fail if username exceeds 20 characters',
    (done) => {
      shouldFail({
        email, username: '123456789012345678901', password, confirm
      }, done);
    }
  );

  it(
    'should fail if username is below 3 characters',
    (done) => {
      shouldFail({
        email, username: '12', password, confirm
      }, done);
    }
  );

  it(
    'should fail if username has invalid characters',
    (done) => {
      shouldFail({
        email, username: '?*#%', password, confirm
      }, done);
    }
  );

  it(
    'should fail if password has less than 8 characters',
    (done) => {
      shouldFail({
        email, username, password: '1234567', confirm
      }, done);
    }
  );

  it(
    'should fail if confirm is not the same as password',
    (done) => {
      shouldFail({
        email, username, password, confirm: confirm + 1
      }, done);
    }
  );

  it(
    'should fail if email is invalid',
    (done) => {
      shouldFail({
        email: 'invalid email', username, password, confirm
      }, done);
    }
  );

  it('should resolve with a success message if registration is successful', (done) => {
    const promise = register({ email, username, password, confirm });
    assert.typeOf(promise, 'Promise');

    promise
      .then((success) => {
        assert.ok(success.message);
        done();
      })
      .catch((error) => {
        done(new Error(error.message));
      });
  });
});
