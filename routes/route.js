var migrate = require('../schema/migrate')
	, schema = require('../schema/schema')
	, df = require('../lib/date')
	, reslv = require('../lib/resolve')
	, express = require('express')
	, auth = require('../config/auth')
	, router = express.Router();
var app;
console.log('router called');

//route for the home page
router.get('/', function(req, res){

	migrate.repositoryMigrate();
	var prs, c;
	console.log('index router called');
	reslv.getPRs('pulls', function(d){
		var rnd2 = Math.floor(Math.random()*1000000000+1);
		var rnd = (Math.random() + 1).toString(16).substring(2);
		for(var c = ''; c.length < 32;) c += Math.random().toString(36).substr(2, 1)
		var urlParam = "client_id=" + auth.github_client_id.toString() + "&state=" + c + ""
		// var urlGit = "https://github.com/login/oauth/authorize?client_id=" + auth.github_client_id + "&state=" + c
		prs = d;
		compDoc = schema.completeDoc;

	for(var i = 0; i < compDoc.length; i++){
      for(var k = prs.length-1; k >=0; k--){
        var name = prs[k].split('  ');
        if(compDoc[i].name == name[0])
          	compDoc[i].pulls = name[1];
      }
     }

	res.render('index', {
		names: schema.names,
		issuesNo: schema.issues,
		completeDoc: compDoc,
		pullsNo: prs,
		urlParam: urlParam,
		state: c,
		header: 'Main page'
		});
	});
});

//route for single repository data
router.get('/repo/details/:repoName?', function(req, res) {
	console.log('repoName router called');
  	var nameParam = null;
  	nameParam = req.params.repoName;	
  	reslv.resolveIssueData(nameParam, req, res);	
});

router.get('/repo/issue/details/:team?', function(req, res) {
	console.log('team issues router called');
  	var nameParam = null;
  	nameParam = req.params.team;
  	reslv.resolveIssueDates(nameParam, req, res);
});

function resolveDate(fullDate) {
	partDate = fullDate.split(' = ');

	return partDate[0];
}

router.get('/login', function(req, res) {
	console.log('login page called');
	reslv.initiateLogin(req, res);
});

router.post('/login', function(req, res){
    	username = req.body.username;
    	password = req.body.password;
	reslv.validateLogin(req, res, function(result, data){
		if(!result) {
    			res.redirect('/login');
		} else {
			req.session.username = data[0].username;
			app.locals.username = data[0].username;
			res.redirect('/');
		}
	});
});

router.get('/register', function(req, res) {
	console.log('register page called');
	reslv.initiateRegistration(req, res);
});

router.post('/register', function(req, res) {
	 reslv.validateRegistration(req, res);
});

router.get('/logout', function(req, res) {
	req.session.destroy();
	app.locals.username = '';
	res.redirect('/');
});

//STATUS: 404 back-up
router.get('*', function(req, res) {
	res.end('<h1>you\'ve been 404\'d</h1>');
});

module.exports = function(appl, serv) {
	app = appl;
	app.locals.username = '';
	return router;
}
