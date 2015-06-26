var mongoClient = require("mongodb").MongoClient
    , tmpLog = require('../lib/tmpLogger');

//connect to mongoDB and aquire data for all documents concerning repositories
exports.initConnection = function() {
 	console.log('schema connecting...');
    tmpLog.update('CONNECTION','mongoDB connection made', true);
	var projection = { "name": 1, "open_issues": 1, "_id": 0 }
	repoNames = [];
	issueNo = [];
	connection("repositories", function(db){
		db.collection('repos').find({}, projection).each(function(err, doc){
	 		if(err) throw err;

			if(doc == null){
				db.close();
			}else{	
				repoNames.push(doc.name);
				issueNo.push(doc.open_issues);
			}
			exports.names = repoNames;
			exports.issues = issueNo;
			db.close();
		});  
	});
};


//connect to mongoDB and aquire data for a given repository
//set the view with relevant data
exports.getRecord = function(param, callback){
	var query = { "name": param };
	console.log('schema connecting...');
	tmpLog.update('CONNECTION','mongoDB connection made', true);
	connection("repositories", function(db){
		db.collection('repos').findOne(query, function(err, doc){
 			if(err) throw err;

  			tmpLog.update('QUERY TARGET' ,doc.name + ": outstanding issues: " + doc.open_issues, false);
  			db.close();

			callback(doc);
  		});  
    });
};

var connection = function(dbase, callback) {
	mongoClient.connect("mongodb://127.0.0.1:27017/" + dbase, function(err, db){
		if(err) throw err;
		callback(db)
	});
};

exports.executeQuery = function(database, param, callback) {
	var query = {"repo": param};
	collection = query.repo;
	var queryStr = getQuery(database);
	var projection = getProjection(database);
	connection(database, function(db){
		db.collection(collection).find(queryStr, projection).toArray(function(err, doc){
			if(err) throw err;
			if(database == 'issues'){
				callback(doc, collection);
			}else{
				callback(doc);
			}
			db.close();
		});
	});
};
 
var getProjection = function(db) {
	var projection;
	if (db === 'issues') {
		projection = { 'created_at': 1, 'title': 1, '_id': 0 };
	} else if (db === 'repoHistory') {
		projection = { 'isoDate': 1, 'rawDate': 1, 'issues': 1, '_id': 0 }
	} else if(db === 'repositories') {
		projection = { "name": 1, "open_issues": 1, "_id": 0 }
	} else {
		projection = { '_id': 0 }
	}

	return projection;
}

var getQuery = function(db) {
	var seconds = new Date().getTime() / 1000;
	seconds = seconds - 2592000;
	var query;
	query = (db === 'repoHistory') ? {"secondsDate": { "$gt": seconds }} : {};

	return query;
}




