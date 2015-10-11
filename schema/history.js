var fs = require('fs')
	, helper = require('../lib/helper')
	, MongoClient = require('mongodb').MongoClient;

var history = {}
var color = helper.terminalCol();
/**
 * Initiate the process of obtaining repository PR and issue history
 * 
 */
history.init = function (){
	this.getDataOverTime('repoHistory', 'issue')
	this.getDataOverTime('repoPullsHistory', 'pulls')
	this.getClosedDataOverTime('repoClosedPullsHistory', 'PR')
	this.getClosedDataOverTime('repoClosedIssueHistory', 'issue')
}

/**
 * Responsible for obtaining both issues and pulls for a 30 day period
 * 
 * @param {String} database
 * @param {String} target
 */
history.getDataOverTime = function(database, target) {
	this.resetHistory(database);
	this.getHistoryFile(target, false, function(err, data) {
    if(err) throw err;
    	history.connect(database, function(db){
	      	repoChunk = data.split('*');
		    for(var i = 1; i < repoChunk.length; i++){
		    	repoDt = repoChunk[i].split(',');
				var date = repoDt[0];
				for(var j = 1; j < repoDt.length-1; j++){
					var arr = repoDt[j].trim().split('  ');
		   			var collection = arr[0].trim(); 
		   			var amount = arr[1];
		   			dates = date.split(' = ')
					var doc = target == 'pulls' ?
					{ 'team': collection, 'isoDate': new Date(dates[0]), 'rawDate': dates[0], 'secondsDate': parseInt(dates[1]), 'pulls': amount } :
					{ 'team': collection, 'isoDate': new Date(dates[0]), 'rawDate': dates[0], 'secondsDate': parseInt(dates[1]), 'issues': amount }

			   		db.collection(collection).insert(doc, function(err, inserted){
			   			if(err) throw err;
			   		});
				}
		    }
			setTimeout(function() {
				db.close();
			}, 1000)
    	});
	});
	var col = [color['cyan']];
	helper.print(color['cyan'],'HISTORY', '- new ' + target +' history added');
}

/**
 * This function reads from a text file to aquire the history of a given repository
 * 
 * @param {String} target
 * @param {Boolean} closed
 * @param {Function} callback
 */
history.getHistoryFile = function(target, closed, callback) {
	target = closed ? 'closed_' + target : 'repo_' + target;
	fs.readFile('./repoData/' + target + '_history.txt','UTF-8', function(err, data){
		callback(err, data);
	});
}

/**
 * Responsible for obtaining both closed issues and closed pulls for a 30 day period
 * 
 * @param {String} database
 * @param {String} target
 */
history.getClosedDataOverTime = function(database, target) {
	this.resetHistory(database);
	this.getHistoryFile(target, true, function(err, data) {
    if(err) throw err;
    	history.connect(database, function(db){
	      	repoChunk = data.split('*');
		    for(var i = 1; i < repoChunk.length; i++){
		    	repoDt = repoChunk[i].split(',');
				var date = repoDt[0];
				for(var j = 1; j < repoDt.length-1; j++){
					var arr = repoDt[j].trim().split('  ');
		   			var collection = arr[0].trim(); 
		   			var amount = arr[1];
		   			dates = date.split(' = ')
					var doc = target == 'PR' ?
					{ 'team': collection, 'isoDate': new Date(dates[0]), 'rawDate': dates[0], 'secondsDate': parseInt(dates[1]), 'pulls': amount } :
					{ 'team': collection, 'isoDate': new Date(dates[0]), 'rawDate': dates[0], 'secondsDate': parseInt(dates[1]), 'issues': amount }

			   		db.collection(collection).insert(doc, function(err, inserted){
			   			if(err) throw err;
			   		});
				}
		    }
			setTimeout(function() {
				db.close();
			}, 600)
    	});
	});
	helper.print(color['cyan'],'HISTORY', '- new ' + target +' history added');
}

/**
 * Reset the history from the previous running of the server
 * 
 * @param {String} rep
 */
history.resetHistory = function(rep) {
	history.connect(rep, function(db){
		db.dropDatabase();
		db.close();
	});
	helper.print(color['cyan'],'HISTORY', '- prev ' + rep +' DB history removed');
}

/**
 * Connect to a given collection via Mongodb
 * 
 * @param {String} dbase
 * @param {Function} callback
 */
history.connect = function(dbase, callback) {
	MongoClient.connect("mongodb://127.0.0.1:27017/" + dbase, function(err, db){
		if(err) throw err;
		callback(db);
	});
}

module.exports = history.init();
