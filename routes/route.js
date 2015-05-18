var migrate = require('../schema/migrate');
var schema = require('../schema/schema');
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
	var repoHistory;
  	var nameParam = null;
  	nameParam = req.params.repoName;
  	
  	schema.getHistory(nameParam, function(data){
  		repoHistory = data;
  	});
 
	schema.getRecord(nameParam, function(doc){

		var commitUrl = doc.commits_url.toString();
    	var newCommitStr = commitUrl.replace("{\/sha}", "");

    	var issUrl = doc.issues_url.toString();
    	var issueURLStr = issUrl.replace("{\/number}", "");

 		res.render('repo-data',{
 			name: doc.name,
 			watchers: doc.watchers_count,
			creation: doc.created_at,
			description: doc.description,
			forksNo: doc.forks_count,
			openIssues: doc.open_issues,
			issuesUrl: issueURLStr,
			commitsUrl: newCommitStr,
			history: repoHistory
 	    });
	}); 
});

router.get('/repo/issue/details/:team?', function(req, res) {
	console.log('team issues router called');
  	var nameParam = null;
  	nameParam = req.params.team;
	schema.getIssueDates(nameParam, res, nameParam); 
	console.log('issues router called');

});

function resolveDate(fullDate) {
	partDate = fullDate.split(' = ');

	return partDate[0];
}
module.exports = router;