var mongoClient = require("mongodb").MongoClient
    , helper = require('../lib/helper')
    , fs = require('fs')
    , bcrypt = require('bcryptjs')
    , _ = require('underscore')
    , CronJob = require('cron').CronJob;
var hash;
writeArr = '';


var schema = {};
/*  //////////keep this code for switching cronjobs from PHP to nodeJS///////////////////
/////////////////////////////////////////////////////////////////////////////////////////
new CronJob('* 5 * * *', function() {
	for(var i = 1; i < 49; i++){
		var obj = require('../repoData/pulls/open/' + i + "_pulls");
		if(obj == ""){
			continue
		}
		
    	var url = _.map(obj, function(data) {return data.url;})
	    var dataName = helper.getSplitValue(url, 5, '/');
	    writeArr += '' + dataName + '  '+obj.length + ',\n';
	}

		var d = new Date();
		var seconds = d.getTime()/1000;
		seconds = seconds.toString().split('.');
		var n = d.toISOString();
		n = n.substring(19,0)
		newString = '*' + n + 'Z = ' + seconds[0] +',\n'+writeArr;
		fs.appendFile('repoData/repo_pulls_history.txt', newString, function (err) {
  				if (err) throw err;
  				helper.log('CRONJOB','Job written for '+ new Date(), true);
				});
}, null, true, "Europe/London");
*/

//connect to mongoDB and aquire data for all documents concerning repositories
schema.initConnection = function() {
	self = this;
 	console.log('schema connecting...');
    helper.log('CONNECTION','mongoDB connection made', true);
	var projection = { "name": 1, "open_issues": 1,"forks_count": 1, "watchers":1, "_id": 0 }
	repoNames = [];
	issueNo = [];
	completeD = [];
	connection("repositories", function(db){
		db.collection('repos').find({}, {}).each(function(err, doc){
	 		if(err) throw err;

			if(doc == null){
				db.close();
			}else{	
				repoNames.push(doc.name);
				issueNo.push(doc.open_issues);
				completeD.push({"name":doc.name,"issues":doc.open_issues, "forks":doc.forks_count, "watchers": doc.watchers, "github_url": doc.html_url})
			}
			self.names = repoNames;
			self.issues = issueNo;
			self.completeDoc = completeD;
			db.close();
		});  
	});
};

//connect to mongoDB and aquire data for a given repository
//set the view with relevant data
schema.getRecord = function(param, callback){
	var query = { "name": param };
	console.log('schema connecting...');
	helper.log('CONNECTION','mongoDB connection made', true);
	connection("repositories", function(db){
		db.collection('repos').findOne(query, function(err, doc){
 			if(err) throw err;
  			helper.log('QUERY TARGET' ,doc.name + ": outstanding issues: " + doc.open_issues, false);
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

schema.executeQuery = function(database, param, callback) {
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
 
 schema.getAllHistory = function(database, dataSet, callback) {
 	var collection = [];
 	var completeData = [];
 	var seconds = new Date().getTime() / 1000;
	seconds = seconds - 2592000; // ensure only the last 30 days of data are displayed
	var queryStr = { "secondsDate": { "$gt": seconds }};
	var projection = { 'isoDate': 1, 'name': 1, 'rawDate': 1, 'issues': 1, '_id': 0 };
 	collection = _.map(dataSet, function(collect){	return collect.name	});
 	connection(database, function(db){
 		_.map(collection, function(coll) {
			db.collection(coll).find(queryStr,{}).toArray(function(err, allHistory){
				if(err) throw err;
				completeData.push(allHistory);
			});
		});
		// db.close();
		callback(completeData)
	});
 }

var getProjection = function(db) {
	var projection;
	if (db === 'issues') {
		projection = { 'created_at': 1, 'title': 1, 'html_url': 1, '_id': 0 };
	} else if (db === 'repoHistory') {
		projection = { 'isoDate': 1, 'rawDate': 1, 'issues': 1, '_id': 0 }
	} else if (db === 'repoPullsHistory') {
		projection = { 'isoDate': 1, 'rawDate': 1, 'pulls': 1, '_id': 0 }
	} else if(db === 'repositories') {
		projection = { "name": 1, "open_issues": 1, "_id": 0 }
	} else {
		projection = { '_id': 0 }
	}
	return projection;
}

var getQuery = function(db) {
	var seconds = new Date().getTime() / 1000;
	seconds = seconds - 2592000; // ensure only the last 30 days of data are displayed
	var query = (db === 'repoHistory') ? {"secondsDate": { "$gt": seconds }} : {};
	return query;
}

schema.regUser = function(username, email, res) {
	var user = new User(username, email);
	user.register(res);
}

schema.loginUser = function(email, pwd, res, fn) {
	var projection = { 'username': 1, 'email': 1, 'password': 1, '_id': 0 };
	var query = { 'email': email };
	connection('user', function(db) {
		db.collection('users').find(query, projection).toArray(function(err, doc){
			if(err) throw err;
			db.close();
			if (!doc.length) {
				res.render('login', { login: 'incorrect' });			
			} else if (!bcrypt.compareSync(pwd, doc[0].password)) {
				res.render('login', { login: 'incorrect' });
			} else {
				fn(true, doc);
			}
		});
	});
}


schema.checkForEmail = function(username, fn) {
	var projection = { 'username': 1, 'email': 1 };
	var query = { 'username': username };
	connection('user', function(db){
		db.collection('users').find(query, projection).toArray(function(err, doc){
			if(err) throw err;
			db.close();
			if(!doc.length) {
				fn(false)
			} else {
				for(var s in doc) {
					fn(doc[0].email)
				}
			}
		})
	})
}

function User(username, email, pass) {
	var self = this;
	this.username = username;
	this.email = email;
	this.pass = pass;
}

User.prototype.register = function(res) {
	// hash = bcrypt.hashSync(this.pass, bcrypt.genSaltSync(10));
	var query = { 'username': this.username, 'email': this.email};
	connection('user', function(db) {
		db.collection('users').insert(query, function(err, result){
			console.log('user made');
			if (err && err.code == 11000) {
				statusR = 'Email has been used before.';
				res.render('register', { register: 'Email has been used before' });
				 console.log('Duplicate Email: Alert User');
			} else {
				res.render('login', { login: 'You will now recieve an  email anytime an issue or PR is assigned to you' });
				statusR = 'good';
			}			
		});
		db.close();
	});	
}


module.exports = schema;
