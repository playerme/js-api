var _mocha=require('mocha');var _chai=require('chai');var _utils=require('../lib/utils');var _auth=require('../../dist/auth');





(0,_mocha.describe)('auth.prelogin',function(){
var nonExistingUsername=process.env.NON_EXISTING_USERNAME;
var username=process.env.USERNAME;

(0,_mocha.it)('should be defined,\n        return a Promise,\n        and fail if arguments are not valid',



function(done){
_chai.assert.ok(_auth.prelogin);
_chai.assert.typeOf((0,_auth.prelogin)(),'Promise');
(0,_utils.shouldFail)((0,_auth.prelogin)(),done);});



(0,_mocha.it)('should fail if user does not exist',

function(done){return (0,_utils.shouldFail)(
(0,_auth.prelogin)({login:nonExistingUsername}),done);});



(0,_mocha.it)('should resolve to a user object if successful',

function(done){return (0,_utils.shouldSucceed)(
(0,_auth.prelogin)({login:username}),
function(user){
_chai.assert.typeOf(user,'object');
_chai.assert.ok(user.id);
_chai.assert.equal(user.username,username);},

done);});});