var helper = require('../lib/helper')
	, MongoClient = require('mongodb').MongoClient
	, request = require('request')
	, _ = require('lodash')
	, allRepos = require('../repoData/rep');
		
var repoArray = _.map(allRepos, function(reps){ return reps.length; });

var migrate = module.exports = {};

/**
 * Migrate all of the jquery repositories into mongodb
 * Whilst deleting previous history
 * 
 */
migrate.repositoryMigrate = function() {
	helper.log('DATA MIGRATION', 'repositories loading...', false);
	connect('repositories', function(db){
		db.collection('repos').remove({});
	    db.collection('repos').insert(allRepos, function(err, data){
	    	if(err) throw err;
	    	helper.log('DATA MIGRATION', 'jquery repositories loaded', true);
			db.close();
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
	        var url = _.map(obj, function(data) { return data.url; })
		    var dataName = helper.getSplitValue(url, '/', 5);
		    db.collection(dataName).remove({});
	        db.collection(dataName).insert(obj, function(err, data){
	            if(err) throw err;
	        });
			setTimeout(function() {
				db.close();	
			}, 3000);
		}
		helper.log('DATA MIGRATION', 'jquery open issues loaded', true);
	});
}

/**
 * Migrate all open Pull requests data to mongodb
 * 
 */
migrate.pullsMigrate = function() {
	connect('pulls', function(db){
		var index = 0;
		while(++index < repoArray.length) {
			var obj = require('../repoData/pulls/open/' + index + "_pulls");
			if(obj == ""){
				continue
			}
        	var url = _.map(obj, function(data) { return data.url; })
		    var dataName = helper.getSplitValue(url, '/', 5);
		    db.collection(dataName).remove({});
	        db.collection(dataName).insert(obj, function(err, data){
            	if(err) throw err;
        	});
			setTimeout(function() {
				db.close();
			}, 3000)
		}
		helper.log('DATA MIGRATION', 'jquery open pulls loaded', true);
	});
}

/**
 * Migrate all repository events to mongodb
 * 
 */
migrate.eventsMigrate = function() {
    connect('events', function(db){
    	var index = 0;
    	while(++index < repoArray.length) {
			var obj = require('../repoData/events/' + index + "events");
			if(obj == ""){
				continue
			}
        	var url = _.map(obj,function(data) { return data.url; })
		    var dataName = helper.getSplitValue(url, '/', 5);
		    dataName = helper.getSplitValue(dataName, ',', 0);
		    db.collection(dataName).remove({});
	        db.collection(dataName).insert(obj, function(err, data){
            	if(err) throw err;
        	});
			setTimeout(function() {
				db.close();
			}, 1000)
		}
		helper.log('DATA MIGRATION', 'jquery events loaded', true);
	});
}

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
		db.close();
		helper.log('DATA MIGRATION', 'jquery closed ' + targetData + ' loaded', true);
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
migrate.eventsMigrate();
