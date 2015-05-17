var mongoClient = require("mongodb").MongoClient;
var tmpLog = require('../repoData/tmpLogger');

//connect to mongoDB and aquire data for all documents concerning repositories
mongoClient.connect("mongodb://127.0.0.1:27017/repositories", function(err, db){
 	console.log('schema connecting...');
    if(err) throw err;
    tmpLog.update('CONNECTION','mongoDB connection made', true );

	var query = {};
	var projection = {"name": 1, "open_issues": 1,"_id": 0}
	repoNames = [];
	issueNo = [];
	var index = 0;
	db.collection('repos').find(query, projection).each(function(err, doc){
 		if(err) throw err;

		if(doc == null){
			db.close();
		}else{	
			repoNames[index] = doc.name;
			issueNo[index] = doc.open_issues;
			index++;
		}
		exports.names = repoNames;
		exports.issues = issueNo;
		db.close();
	});  
});

//connect to mongoDB and aquire data for a given repository
//set the view with relevant data
exports.getRecord = function(req, res, param){
	var query = {"name": param};
	console.log('schema connecting...');
	mongoClient.connect("mongodb://127.0.0.1:27017/repositories", function(err, db){

  		if(err) throw err;
	    tmpLog.update('CONNECTION','mongoDB connection made', true);

		var singleRepo = [], index = 0;
		db.collection('repos').findOne(query, function(err, doc){
 			if(err) throw err;

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
			 	commitsUrl: newCommitStr
 	    		});
 
 			dataSet = {
 				name: doc.name,
 				openIssues: doc.open_issues,
 				watchers: doc.watchers_count,
 				created: doc.created_at,
 				description: doc.description
 			}
  			singleRepo[index] = [ doc.name, doc.watchers_count, doc.created_at, doc.description ];

  			console.dir( dataSet);
  			db.close();

  		});  
	});  
 }

exports.getIssueDates = function(req, res, param){
	var query = {"team": param};
	var issueDataSet;
	teamName = query.team;
	var issueDates = [], index = 0;
	console.log('issue schema connecting...');
	console.log(query.team);
	mongoClient.connect("mongodb://127.0.0.1:27017/issues", function(err, db){
		var projection = { "created_at": 1,"_id": 0}
		if(err) throw err;

		 tmpLog.update('CONNECTION','mongoDB connection made', true);

		db.collection(teamName).find({}, projection).toArray(function(err, doc){
		if(err) throw err;

			tmpLog.update('QUERY','mongoDB query made', false);
			issueDates[index] = [doc.created_at];
			index++;
			res.render('issue-data', {name: teamName, date: doc})
			exports.date = issueDates;
			exports.name = teamName;
		
		db.close();
		});  

	});  
}
 



 







