var helper = require('../lib/helper')
	, MongoClient = require('mongodb').MongoClient
	, request = require('request')
	, _ = require('lodash')
	, allRepos = require('../repoData/rep');
		
var repoArray = _.map(allRepos, (reps) => { return reps.length; });
var color = helper.terminalCol();
var migrate = module.exports = {};

/**
 * Migrate all of the jquery repositories into mongodb
 * Whilst deleting previous history
 * 
 */
migrate.repositoryMigrate = function() {
	helper.print(color['cyan'],'DATA MIGRATION', 'repositories loading...');
	connect('repositories', (db) => {
		db.collection('repos').remove({});
	    db.collection('repos').insert(allRepos, (err, data) => {
	    	if(err) throw err;
	    	helper.print(color['cyan'],'DATA MIGRATION', '- jquery repositories loaded');
			setTimeout(() => {
				if(db !== null)
					db.close();	
			}, 1000);
	    });
	});
}

/**
 * Migrate all open issue data to mongodb
 * 
 */
migrate.openIssuesMigrate = function() {
	connect('issues', function(db){
		var index = 0;
		while(++index < repoArray.length) {
			var obj = require('../repoData/issues/open/' + index + "_issues");
			if(obj == ""){
				continue
			}
	        var url = _.map(obj, (data) => { return data.url; })
		    var dataName = helper.getSplitValue(url, '/', 5);
		    db.collection(dataName).remove({});
	        db.collection(dataName).insert(obj, (err, data) => {
	            if(err) throw err;
	        });
			//setTimeout(() => {
			//	if(db !== null)
			//		db.close();
			//}, 3000);
		}
		helper.print(color['cyan'],'DATA MIGRATION', '- jquery open issues loaded');
	});
}

/**
 * Migrate all open Pull requests data to mongodb
 * 
 */
migrate.pullsMigrate = function() {
	connect('pulls', (db) => {
		var index = 0;
		while(++index < repoArray.length) {
			var obj = require('../repoData/pulls/open/' + index + "_pulls");
			if(obj == ""){
				continue
			}
        	var url = _.map(obj, (data) => { return data.url; })
		    var dataName = helper.getSplitValue(url, '/', 5);
		    db.collection(dataName).remove({});
	        db.collection(dataName).insert(obj, (err, data) => {
            	if(err) throw err;
        	});
			setTimeout(() => {
				if(db !== null)
					db.close();
			}, 3000)
		}
		helper.print(color['cyan'],'DATA MIGRATION', '- jquery open pulls loaded');
	});
}

/**
 * Migrate all repository events to mongodb
 * 
 */
// migrate.eventsMigrate = function() {
//     connect('events', function(db){
//     	var index = 0;
//     	while(++index < repoArray.length) {
// 			var obj = require('../repoData/events/' + index + "events");
// 			if(obj == ""){
// 				continue
// 			}
//         	var url = _.map(obj,function(data) { return data.url; })
// 		    var dataName = helper.getSplitValue(url, '/', 5);
// 		    dataName = helper.getSplitValue(dataName, ',', 0);
// 		    db.collection(dataName).remove({});
// 	        db.collection(dataName).insert(obj, function(err, data){
//             	// if(err) throw err;
//         	});
// 			setTimeout(function() {
// 				db.close();
// 			}, 1000)
// 		}
// 		helper.print(color['cyan'],'DATA MIGRATION', '- jquery events loaded');
// 	});
// }

/**
 * Migrate all closed issue data to mongodb
 *
 * @param {String} targetData
 * 
 */
migrate.closedDataMigration = function(targetData){
	connect(targetData + 'Closed', function(db){
		for(var i = 1; i < repoArray.length; i++){
			obj = require('../repoData/' + targetData + '/closed/' + i + "_closed_" + targetData + "");
			if(obj == ""){
				continue
			}
        	var url = _.map(obj, function(data) { return data.url; })
		     var dataName = helper.getSplitValue(url, '/', 5);
		    db.collection(dataName).remove({});
		    var batch = db.collection(dataName).initializeUnorderedBulkOp({useLegacyOps: false}); //enable bulk inserting of data 
		    for(var j = 0; j < obj.length; j++){	
		    	batch.insert({  
		    		url: obj[j].url,
			    	id: obj[j].id, 
			    	title: obj[j].title,
			    	body: obj[j].body,
			    	created_at: obj[j].created_at,
			    	updated_at: obj[j].updated_at,
			    	closed_at: obj[j].closed_at,
			    	assignee: obj[j].assignee
			    });
		    }
		    batch.execute(function(err, result){});
		}
		if(db !== null)
			db.close();
		helper.print(color['cyan'],'DATA MIGRATION', '- jquery closed ' + targetData + ' loaded');
	});
}

/**
 * connect to a given database via mongodb
 *
 * @param {String} target 
 * @param {Function} fn 
 */
var connect = function(target, fn) {
	MongoClient.connect("mongodb://127.0.0.1:27017/" + target, function(err, db){
		if(err) throw err;
		fn(db);
	});
}	

migrate.repositoryMigrate();
migrate.openIssuesMigrate();
migrate.pullsMigrate();
migrate.closedDataMigration('pulls');
migrate.closedDataMigration('issues');
// migrate.eventsMigrate();
