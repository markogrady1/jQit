var mongoClient = require("mongodb").MongoClient;
var tmpLog = require('../repoData/tmpLogger');
var historyDoc = [];
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
exports.getRecord = function(param, callback){
	var query = {"name": param};
	console.log('schema connecting...');

	mongoClient.connect("mongodb://127.0.0.1:27017/repositories", function(err, db){
  		if(err) throw err;
	
	    tmpLog.update('CONNECTION','mongoDB connection made', true);
		db.collection('repos').findOne(query, function(err, doc){
 			if(err) throw err;

  			tmpLog.update('QUERY TARGET' ,doc.name + ": outstanding issues: " + doc.open_issues, false);
  			db.close();

			callback(doc);
  		});  
	}); 
 }

exports.getIssueDates = function(req, res, param, callback) {
	var query = {"repo": param};
	// var issueDataSet;
	teamName = query.repo;
	// var issueDates = [], index = 0;
	console.log('issue schema connecting...');
	mongoClient.connect("mongodb://127.0.0.1:27017/issues", function(err, db){
		var projection = { "created_at": 1, "title": 1,"_id": 0}
		if(err) throw err;

		tmpLog.update('CONNECTION','mongoDB connection made', true);

		db.collection(teamName).find({}, projection).toArray(function(err, doc){
		if(err) throw err;

			tmpLog.update('QUERY','mongoDB query made', false);
			db.close();

			callback(doc, teamName);
		});  

	});  
}

exports.getHistory = function(param, callback) {
	var query = {"repo": param};
	collection = query.repo;
	var projection = {"date": 1, "issues": 1, "_id": 0}
	mongoClient.connect("mongodb://127.0.0.1:27017/repoHistory", function(err, db){
		if(err) throw err;

	    db.collection(collection).find({}, projection).toArray(function(err, doc){
 		    if(err) throw err;

 		    tmpLog.update('REPO HISTORY', 'data resolved', false);
			db.close();

			callback(doc);
 	    });
 	});	
}
 



 







