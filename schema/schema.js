var mongoClient = require("mongodb").MongoClient
    , helper = require('../lib/helper')
    , fs = require('fs')
    , bcrypt = require('bcryptjs')
    , _ = require('lodash')
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
	    var dataName = helper.getSplitValue(url, '/', 5);
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

/**
 * connect to mongoDB and aquire data for all documents concerning repositories
 * 
 */
schema.initConnection = function() {
	self = this;
    helper.log('CONNECTION','mongoDB connection made', true);
	var projection = { "name": 1, "open_issues": 1,"forks_count": 1, "watchers":1, "_id": 0 }
	repoNames = [];
	issueNo = [];
	completeD = [];
	connection("repositories", function(db) {
		db.collection('repos').find({}, {}).each(function(err, doc) {
	 		if (err) throw err;

			if (doc == null) {
				db.close();
			} else {	
				repoNames.push(doc.name);
				issueNo.push(doc.open_issues);
				completeD.push({ "name": doc.name, "issues": doc.open_issues, "forks": doc.forks_count, "watchers": doc.watchers, "github_url": doc.html_url })
			}
			self.names = repoNames;
			self.issues = issueNo;
			self.completeDoc = completeD;
			db.close();
		});  
	});
};

/**
 * Connect to mongoDB and aquire data for a given repository
 *  
 * @param {String} param 
 * @param {Function} callback 
 */
schema.getRecord = function(param, callback) {
	var query = { "name": param };
	console.log('schema connecting...');
	helper.log('CONNECTION','mongoDB connection made', true);
	connection("repositories", function(db) {
		db.collection('repos').findOne(query, function(err, doc) {
 			if (err) throw err;
  			helper.log('QUERY TARGET' ,doc.name + ": outstanding issues: " + doc.open_issues, false);
  			db.close();

			callback(doc);
  		});  
    });
};

/**
 * connect to a given database via mongodb
 *
 * @param {String} dbase 
 * @param {Function} callback 
 */
var connection = function(dbase, callback) {
	mongoClient.connect("mongodb://127.0.0.1:27017/" + dbase, function(err, db) {
		if (err) throw err;
		callback(db)
	});
};

/**
 * Execute query to abtain a given collection data
 *
 * @param {String} database 
 * @param {String} param 
 * @param {Function} callback 
 */
schema.executeQuery = function(database, param, callback) {
	var query = {"repo": param};
	collection = query.repo;
	var queryStr = getQuery(database);
	var projection = getProjection(database);
	connection(database, function(db){
		db.collection(collection).find(queryStr, projection).toArray(function(err, doc) {
			if (err) throw err;
			if (database == 'issues') {
				callback(doc, collection);
			} else {
				callback(doc);
			}
			db.close();
		});
	});
};
 
 /**
 * Aquire all jquery repositories issues and PR data within last 30 days
 *
 * @param {String} database 
 * @param {Array} dataSet
 * @param {Function} callback 
 */
 schema.getAllHistory = function(database, dataSet, callback) {
 	var collection = [];
 	var completeData = [];
 	var seconds = new Date().getTime() / 1000;
	seconds = seconds - 2592000; // ensure only the last 30 days of data are displayed
	var queryStr = { "secondsDate": { "$gt": seconds }};
 	collection = _.map(dataSet, function(collect){	return collect.name	});
 	connection(database, function(db){
 		_.map(collection, function(coll) {
			db.collection(coll).find(queryStr,{}).toArray(function(err, allHistory){
				if(err) throw err;
				completeData.push(allHistory);
			});
		});
		setTimeout(function() {
			if(db !== null)
				db.close();
		}, 1000)
		callback(completeData)
	});
 };

/**
 * Create a projection for a given database
 *
 * @param {String} db 
 * @return {Object} projection 
 */
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
};

/**
 * Create a query for a given database
 *
 * @param {String} db 
 * @return {Object} projection 
 */
var getQuery = function(db) {
	var seconds = new Date().getTime() / 1000;
	seconds = seconds - 2592000; // ensure only the last 30 days of data are displayed
	var query = (db === 'repoHistory') ? {"secondsDate": { "$gt": seconds }} : {};
	return query;
};

/**
 * This function checks whether the user has an existing email address in database
 *
 * @param {String} username 
 * @param {Function} fn 
 */
schema.checkForEmail = function(username, fn) {
	var projection = { 'username': 1, 'email': 1 };
	var query = { 'username': username };
	connection('user', function(db){
		db.collection('users').find(query, projection).toArray(function(err, doc){
			if (err) throw err;
			db.close();
			if (!doc.length) {
				fn(false)
			} else {
				var index = -1;
				while(++index < doc.length) {
					fn(doc[0].email)
				}
			}
		})
	})
};

/**
 * Store registered user details to database
 *
 * @param {String} username 
 * @param {String} email 
 * @param {Object} res 
 */
schema.regUser = function(username, email, res, io) {
	var user = RegisteredUser(username, email);
	user.register(res, io);
}

/**
 * Check loggedin user details against database
 *
 * @param {String} email 
 * @param {String} pwd 
 * @param {Object} res 
 * @param {Function} fn 
 */
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
};

/**
 * Check for recent users who are assignees
 *
 * @param {Function} callback 
 */
schema.checkForAssignee = function(callback) {
	var projection = { 'username': 1, 'email': 1, '_id': 0 };
	connection('user', function(db){
		db.collection('users').find({}, projection).toArray(function(err, doc){
			if(err) throw err;
			db.close();
			callback(doc)
		});
	});
};

/**
 * Check for recent users who are assignees of the last 24 hours
 *
 * @param {String} database 
 * @param {String} username 
 * @param {Array} dataSet 
 * @param {Function} callback 
 */
schema.checkForAssigneeMatch = function(database, username, dataSet, callback) {
	var assign = [];
	var query = { 'assignee': username};
	var projection = { 'title': 1, 'assignee': 1, 'created_at': 1, 'html_url': 1,  '_id': 0 };
	collection = _.map(dataSet, function(collect) { return collect });
 	connection(database, function(db) {
 		_.map(collection, function(coll) {
			db.collection(coll).find(query, projection).each(function(err, assigned) {
				if (err) throw err;

				if (assigned !== null) {
					var dateOffset = (24*60*60*1000); //value of one day
					var yest = new Date();
					var yesterday = new Date(yest.setTime(yest.getTime() - dateOffset))//get yesterday's date in mls
					var issueDate = new Date(assigned.created_at).getTime(); //date of issue in mls
					if(issueDate > yesterday) {
						assign.push(assigned)
						callback(assign)
						username = '';
					}
				} 
			});
		});
		setTimeout(function() {
			if(db !== null)
				db.close();
		}, 1000)
	});
};

/**
 * Function responsible for storing the settings to watch over a given repository
 * @param {Object} obj
 */
schema.storeWatchData = function(obj) {

    var flagObj = {
        username: obj.user,
        email: obj.email,
        avatar: obj.avatar,
        target: obj.target,
        receiveEmail: obj.receiveEmailUpadate,
        highlightchart: obj.highlightchart,
        issuesboundary: obj.issuesboundary,
        pullsboundary: obj.pullsboundary
    }
    connection("user", (db) => {
        db.collection('flags').findOne({ username: obj.user }, function(err, doc) {
            if (err) throw err;
            if(doc === null) {
                db.collection("flags").insert( flagObj, (err, data) => {
                    if(err) throw err;
                    db.close();
                });
            } else {
                db.collection("flags").update({ username:obj.user }, flagObj, (err, data) => {
                    if(err) throw err;
                    db.close();
                });
            }
        });
    });
};

/**
 * Function responsible for searching for a flag set by the current user
 * @param {String} username
 * @param {String} email
 * @param {Function} callback
 */
schema.checkForFlags = function(username, email, callback) {
    connection("user", (db) => {
        db.collection("flags").findOne({ username: username, email: email, highlightchart: "true" }, function (err, doc) {
            if (err) throw err;
            callback(doc);
            db.close();
        });
    });
};

schema.checkForFlaggedRepo = function(username, email, target, callback) {
    connection("user", (db) => {
        db.collection("flags").findOne({username:username, email: email, highlightchart: "true", target: target}, (err, doc) => {
            if(err) throw err;
            callback(doc);
            db.close();
        });
    })
};
/**
 * User object constructor
 *
 * @param {String} username 
 * @param {String} email 
 */
function User(username, email) {
	this.username = username;
	this.email = email;
}

/**
 * Create new instances of Users
 *
 * @param {String} x 
 * @param {String} y 
 * @return {Object} User 
 */
var RegisteredUser = function(x, y) { return new User(x, y); };

/**
 * Register the new User
 *
 * @param {Object} res 
 */
User.prototype.register = function(res, io) {
	this.io = io;
	// hash = bcrypt.hashSync(this.pass, bcrypt.genSaltSync(10));  //not used currently because no passwords stored
	var query = { 'username': this.username, 'email': this.email};
	connection('user', function(db) {
		db.collection('users').insert(query, function(err, result){
			console.log('User Created => ' + new Date());
			if (err && err.code == 11000) {
				res.render('register', { register: 'Email has been used before' });
                console.log('Duplicate Email: Alert User');
			} else {
				var data = localStorage.getItem('data');
				var avatar = helper.getSplitValue(data, '=>', 1);
				var avatNum = helper.getSplitValue(avatar, '/', -1)
				res.redirect('/');
				this.io.emit("userStatus",{ av: avatNum })
			}			
		});
		if(db !== null)
			db.close();
	});	
};


module.exports = schema;
