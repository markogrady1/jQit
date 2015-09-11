require('should')
var assert = require('assert');
var resolve = require('../lib/resolve');
var history = require('../schema/history');
'use strict';
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

describe('Get PRs data', function(){
	
	var prString = '2015-08-26T02:00:03Z = 1440576003,\n2012-dev-summit  0,\napi.globalizejs.com  0,\napi.jquery.com  4,\napi.jquerymobile.com  3,\napi.jqueryui.com  0,\napi.qunitjs.com  0,\nblog.jquery.com-theme  0,\nbrand.jquery.org  0,\ncodeorigin.jquery.com  0,\ncontent  0,\ncontribute.jquery.org  2,\ncss-chassis  15,\ndemos.jquerymobile.com  1,\ndownload.jqueryui.com  0,\nesprima  2,\nevents.jquery.org  0,\nglobalize  15,\nglobalizejs.com  0,\ngrunt-jquery-content  0,\ngsoc  0,\nirc.jquery.org  1,\njquery  26,\njquery-color  1,\njquery-compat-dist  0,\njquery-dist  0,\njquery-license  0,\njquery-migrate  3,\njquery-mobile  22,\njquery-mousewheel  2,\njquery-release  0,\njquery-simulate  6,\njquery-ui  29,\njquery-wp-content  5,\njquery.com  3,\njquery.github.io  0,\njquery.org  1,\njquerymobile.com  1,\njqueryui.com  2,\nlearn.jquery.com  9,\nmeetings.jquery.org  0,\nPEP  5,\nplugins.jquery.com  2,\nqunit  8,\nqunitjs.com  1,\nsizzle  4,\nstandards  0,\ntestswarm  3,\nthemeroller.css-chassis.com  0,\nthemeroller.jquerymobile.com  1,\n';


	it('should return an array of split values', function(){
		var arrValue = resolve.getSplitVal(prString);
		arrValue = resolve.formatPRs(arrValue);
		// fix these tests ASAP
		// assert.equal(Array,arrValue );
		// assert.should.equal('object');
	});
})

describe('Open issues', function(){
	it('Valid', function(){
		assert( 'not valid');
	});
})




