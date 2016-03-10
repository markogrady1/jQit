require('should')
var assert = require('assert');
// var User = require('../schema/schema');
//var history = require('../schema/history');

var testUser;
describe('creating new user', function(){	

	before(function(){

		testUser = new User("mark", 'at@someplace.com', '1234');
	});
});

describe('Creating new user', function(){
	it('is valid', function(){
		assert.should.not.equal(undefined);
	});
})

describe('Creating new message receiver', function(){
	it('is valid', function(){
		assert( 'not valid');
	});
})




