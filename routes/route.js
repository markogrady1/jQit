var migrate = require('../schema/migrate')
	, schema = require('../schema/schema')
	, df = require('../lib/date')
	, reslvr = require('../lib/resolve');
var express = require('express');
var router = express.Router();
console.log('router called');
//route for the home page
router.get('/', function(req, res){
	migrate.repositoryMigrate();
	console.log('index router called');
	res.render('index', {names: schema.names, issuesNo: schema.issues});

});

//route for single repository data
router.get('/repo/details/:repoName?', function(req, res) {
	console.log('repoName router called');
  	var nameParam = null;
  	nameParam = req.params.repoName;
  	

  	reslvr.resolveIssueData(nameParam, req, res);
  	
});

router.get('/repo/issue/details/:team?', function(req, res) {
	console.log('team issues router called');
  	var nameParam = null;
  	nameParam = req.params.team;

  	reslvr.resolveIssueDates(nameParam, req, res);
});

function resolveDate(fullDate) {
	partDate = fullDate.split(' = ');

	return partDate[0];
}
module.exports = router;