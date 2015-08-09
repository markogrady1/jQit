var assert = require('assert');
var User = require('../schema/schema');
var history = require('../schema/history');

var testUser;
describe('creating new user', function(){
	

	before(function(){

		testUser = new User("mark", 'at@someplace.com', '1234');
	});
});

describe('Creating new Applicant', function(){
	it('is valid', function(){
		assert( 'not valid');
	});
})

describe('Remove data', function(){
	it('is valid', function(){
		assert( history.resetHistory('repoHistory'), 'not valid');
	});
})