Object.defineProperty(exports,"__esModule",{value:true});exports.













shouldFail=shouldFail;exports.







shouldSucceed=shouldSucceed;function execCheck(result,callback,done){if(done!==callback)callback(result);done();}function throwError(result,done){done(new Error(JSON.stringify(result)));}function shouldFail(promise,callback,done){var _done=done||callback;return promise.then(function(success){return throwError(success,_done);}).catch(function(error){return execCheck(error,callback,_done);});}function shouldSucceed(promise,callback,done){
var _done=done||callback;

return promise.
then(function(success){return execCheck(success,callback,_done);}).
catch(function(error){return throwError(error,_done);});}