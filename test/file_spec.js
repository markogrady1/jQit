require('should')
var assert = require('assert');
// var User = require('../schema/schema');
var history = require('../schema/history');

var data;
describe('obtaining data from text file', function(){	

	before(function(){
		closedIssueData = history.getHistoryFile('issues', true, function(err, data) {
			console.log(closedIssueData)
		})
		openIssueData = history.getHistoryFile('issues',false, function(err, data) {
			console.log(openIssueData);
		});
	});
});

describe('Get open issues data', function(){
	it('Valid', function(){
		assert.should.not.equal(undefined);
	});
})

describe('Open issues', function(){
	it('Valid', function(){
		assert( 'not valid');
	});
})




