var fs = require('fs')
	, tmpLog = require('../lib/tmpLogger')
	, MongoClient = require('mongodb').MongoClient;

var history = {}


history.init = function (){
 	this.resetHistory('repoHistory');
	fs.readFile('./repoData/repo_issue_history.txt','UTF-8', function(err, data){
    if(err) throw err;
    	history.connect('repoHistory', function(db){
	      	repoChunk = data.split('*');
		    for(var i = 1; i < repoChunk.length; i++){
		    	repoDt = repoChunk[i].split(',');
				var date = repoDt[0];
				for(var j = 1; j < repoDt.length-1; j++){
					var arr = repoDt[j].trim().split('  ');
		   			var collection = arr[0].trim(); 
		   			var issueAmount = arr[1];
		   			dates = date.split(' = ')
					var doc = {'isoDate': new Date(dates[0]), 'rawDate': dates[0], 'secondsDate': parseInt(dates[1]), 'issues': issueAmount};
			   		db.collection(collection).insert(doc, function(err, inserted){
			   			if(err) throw err;
			   		});
				}
		    }
    	});
	});
	tmpLog.update('HISTORY', 'new issue hist added', false);
	this.pullsHistory();
}

history.pullsHistory = function() {
this.resetHistory('repoPullsHistory');
	fs.readFile('./repoData/repo_pulls_history.txt','UTF-8', function(err, data){
    if(err) throw err;
    	history.connect('repoPullsHistory', function(db){
	      	repoChunk = data.split('*');
		    for(var i = 1; i < repoChunk.length; i++){
		    	repoDt = repoChunk[i].split(',');
				var date = repoDt[0];
				for(var j = 1; j < repoDt.length-1; j++){
					var arr = repoDt[j].trim().split('  ');
		   			var collection = arr[0].trim(); 
		   			var issueAmount = arr[1];
		   			dates = date.split(' = ')
					var doc = {'isoDate': new Date(dates[0]), 'rawDate': dates[0], 'secondsDate': parseInt(dates[1]), 'pulls': issueAmount};
			   		db.collection(collection).insert(doc, function(err, inserted){
			   			if(err) throw err;
			   		});
				}
		    }
    	});
	});
	tmpLog.update('HISTORY', 'new PR hist added', false);
}

history.resetHistory = function(rep) {
	history.connect(rep, function(db){
		db.dropDatabase();
		db.close();
	});
	tmpLog.update('HISTORY', 'prev hist removed', false);
}

history.connect = function(dbase, callback) {
	MongoClient.connect("mongodb://127.0.0.1:27017/" + dbase, function(err, db){
		if(err) throw err;
		callback(db);
	});
}
module.exports = history.init();
