var migrate = require('../schema/migrate');
var schema = require('../schema/schema');
var express = require('express');
var router = express.Router();
console.log('router called');
// migrate.repositoryMigrate();
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
	schema.getRecord(nameParam, res, nameParam); 

});

router.get('/repo/issue/details/:team?', function(req, res) {
	console.log('team issues router called');
  	var nameParam = null;
  	nameParam = req.params.team;
	schema.getIssueDates(nameParam, res, nameParam); 
	console.log('issues router called');
		// res.render('issue-data', {name: schema.name, date: schema.date})

});

module.exports = router;