require('./reset');var _mocha=require('mocha');var _chai=require('chai');var _utils=require('../lib/utils');var _auth=require('../../dist/auth');







(0,_mocha.describe)('auth.forgot',function(){
var nonExistingUsername=process.env.NON_EXISTING_USERNAME;
var username=process.env.USERNAME;

(0,_mocha.it)('should be defined,\n        return a Promise,\n        and fail if arguments are not valid',



function(done){
_chai.assert.ok(_auth.forgot);
_chai.assert.typeOf((0,_auth.forgot)(),'Promise');
(0,_utils.shouldFail)((0,_auth.forgot)(),done);});



(0,_mocha.it)('should fail if user does not exist',

function(done){return (0,_utils.shouldFail)(
(0,_auth.forgot)({username:nonExistingUsername}),
done);});



(0,_mocha.it)('should resolve with a success message if user exists',

function(done){return (0,_utils.shouldSucceed)(
(0,_auth.forgot)({username:username}),
function(success){return _chai.assert.ok(success.message);},
done);});});