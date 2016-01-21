function execCheck(result, callback, done) {
  if (done !== callback) callback(result);

  done();
}

function throwError(result, done) {
  done(
    new Error(
      JSON.stringify(result)
    )
  );
}

export function shouldFail(promise, callback, done) {
  const _done = done || callback;

  return promise
    .then(success => throwError(success, _done))
    .catch(error => execCheck(error, callback, _done));
}

export function shouldSucceed(promise, callback, done) {
  const _done = done || callback;

  return promise
    .then(success => execCheck(success, callback, _done))
    .catch(error => throwError(error, _done));
}
