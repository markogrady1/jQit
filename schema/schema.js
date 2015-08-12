var mongoClient = require("mongodb").MongoClient
    , tmpLog = require('../lib/tmpLogger')
    , fs = require('fs')
    , bcrypt = require('bcryptjs')
    , CronJob = require('cron').CronJob;
var hash;
writeArr = '';

/*  //////////keep this code for switching cronjobs from PHP to nodeJS///////////////////
/////////////////////////////////////////////////////////////////////////////////////////
new CronJob('* 5 * * *', function() {
	for(var i = 1; i < 49; i++){
		var obj = require('../repoData/pulls/open/' + i + "_pulls");
		if(obj == ""){
			continue
		}
		
    	var url = mapping(obj, function(data) {return data.url;})
	    var dataName = splitValue(url, 5, '/');
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
  				tmpLog.update('CRONJOB','Job written for '+ new Date(), true);
				});
}, null, true, "Europe/London");
*/

var splitValue = function(origVal, index, separator) {
			var a = origVal.toString();
		    var v = a.split(separator);
		    var d = v[index];  
		    return d;
}

var mapping = function(dat, fn) {
	var d = dat.map(fn);

	return d;
}




//connect to mongoDB and aquire data for all documents concerning repositories
exports.initConnection = function() {
 	console.log('schema connecting...');
    tmpLog.update('CONNECTION','mongoDB connection made', true);
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
			exports.names = repoNames;
			exports.issues = issueNo;
			exports.completeDoc = completeD;
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
 
 exports.getAllHistory = function(database, dataSet, callback) {
 	var collection = [];
 	var dbase;
 	var completeData = [];
 	var seconds = new Date().getTime() / 1000;
	seconds = seconds - 2592000; // ensure only the last 30 days of data are displayed
	var queryStr = {"secondsDate": { "$gt": seconds }};
	var projection = { 'isoDate': 1, 'name': 1, 'rawDate': 1, 'issues': 1, '_id': 0 };
 	for(var z in dataSet) {
 		collection.push(dataSet[z].name);
 	}
 	
 		connection(database, function(db){
	for(var c in collection) {
	db.collection(collection[c]).find(queryStr,{}).toArray(function(err, docMain){
			if(err) throw err;
			completeData.push(docMain);
			
		});
	}
	
 		});callback(completeData)
 }

var getProjection = function(db) {
	var projection;
	if (db === 'issues') {
		projection = { 'created_at': 1, 'title': 1, '_id': 0 };
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


function User(username, email, pass) {
	var self = this;
	this.username = username;
	this.email = email;
	this.pass = pass;
}

User.prototype.register = function(res) {
	hash = bcrypt.hashSync(this.pass, bcrypt.genSaltSync(10));
	var query = { 'username': this.username, 'email': this.email, 'password': hash };
	connection('user', function(db){
		db.collection('users').insert(query, function(err, result){
			console.log('user made');
			if (err && err.code == 11000){
				statusR = 'Email has been used before.';
				res.render('register', { register: 'Email has been used before' });
				 console.log('Duplicate Email: Alert User');
			} else {
				res.render('login', { login: 'You may now login' });
				statusR = 'good';
			}			
		});
		db.close();
	});	
}

exports.regUser = function(username, email, pass, res) {
	var user = new User(username, email, pass);
	user.register(res);
	console.log(user);
}

exports.loginUser = function(email, pwd, res, fn) {
	var projection = { 'username': 1, 'email': 1, 'password': 1, '_id': 0 };
	var query = { 'email': email };
	connection('user', function(db) {
		db.collection('users').find(query, projection).toArray(function(err, doc){
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
