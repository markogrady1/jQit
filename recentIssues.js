var fs = require('fs')
	,tmpLog = require('./repoData/tmpLogger')
	,MongoClient = require('mongodb').MongoClient;

var hist = require('./schema/history');
hist.resetHistory();
var repoChunk = {};
var repoDt = {};


exports.migrateHistory = function (){

	fs.readFile('./repoData/repo_history.txt','UTF-8', function(err, data){
     if(err) throw err;

	MongoClient.connect("mongodb://127.0.0.1:27017/repoHistory", function(err, db){
		if(err) throw err;	

      //get each day consisting of date, repo and issues
      repoChunk = data.split('*');

      //loop through days
      for(var i = 1; i < repoChunk.length; i++){

    	//get each repository name and issue amount
    	repoDt = repoChunk[i].split(',');

    	//get date of current repos record
		var date = repoDt[0];

		for(var j = 1; j < repoDt.length-1; j++){
			var jsonData = JSON.stringify(repoDt[j]);

			var arr = repoDt[j].trim().split('  ');
   			var collection = arr[0].trim(); 
   			var issueAmount = arr[1];
			var doc = {'date': date, 'issues': issueAmount};

	   		db.collection(collection).insert(doc, function(err, inserted){
	   		if(err) throw err;
	   		
	   		// db.close(); 
	   		});
		}
      }
	});
});
	tmpLog.update('HISTORY', 'new hist added', false);
}
