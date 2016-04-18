var async = require("async")
    , mongoClient = require("mongodb").MongoClient;


var teamModel = {};

teamModel.getTeamRepoData = function(teamRepos, dbase, callback) {
    var totalData = [];
    var projection = this.getProjection(dbase);//not used currently
    connection(dbase, function(db){
        async.each(teamRepos, function(item, callback){
            db.collection(item).find({},{}).toArray(function(err, doc) {
                if (err) throw err;
                totalData.push(doc);
            });
            callback();
        }, function(err) {
            setTimeout(() => {
                callback(totalData);
                if(db !== null)
                    db.close();
            }, 500);
        });
    });
};

teamModel.getTeamRepoRecord = function(teamRepos, dbase, callback) {
    var totalData = [];
    var projection = this.getProjection(dbase);//not used currently
    connection(dbase, function(db){
        async.each(teamRepos, function(item, callback){
            var query = { "name": item };
            db.collection('repos').findOne(query, function(err, doc) {
                if (err) throw err;
                totalData.push(doc);
            });
            callback();
        }, function(err) {
            setTimeout(() => {
                callback(totalData);
                if(db !== null)
                    db.close();
            }, 500);
        });
    });
};

teamModel.checkForFlaggedTeam = function(username, email, target, callback) {
    connection("user", (db) => {
        db.collection("teamFlag").findOne({$or: [ { highlight_team_issues_chart: "true" }, { highlight_team_pulls_chart: "true" } ], username: username, email: email, team_target: target }, (err, doc) => {
            if(err) throw err;
            callback(doc);
            db.close();
        });
    })
};
teamModel.checkForFlaggedContentTeam = function(username, email, target, callback) {
    connection("user", (db) => {
        db.collection("contentTeamFlag").findOne({$or: [ { highlight_content_team_issues_chart: "true" }, { highlight_content_team_pulls_chart: "true" } ], username: username, email: email, content_team_target: target }, (err, doc) => {
            if(err) throw err;
            callback(doc);
            db.close();
        });
    })
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


teamModel.getProjection = function(db) {
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
 * Execute query to abtain a given collection data
 *
 * @param {String} database
 * @param {String} param
 * @param {Function} callback
 */
teamModel.executeQuery = function(database, param, callback) {
    var query = { "repo": param };
    collection = query.repo;
    //var queryStr = getQuery(database);
    var projection = { 'isoDate': 1, 'rawDate': 1, 'pulls': 1, '_id': 0 };
    connection(database, function(db){
        db.collection(collection).find({}, projection).toArray(function(err, doc) {
            if (err) throw err;
            console.log(doc)
            callback(doc);

            db.close();
        });
    });
};

/**
 * Function responsible for searching for a flag set by the current user
 * @param {String} username
 * @param {String} email
 * @param {Function} callback
 */
teamModel.checkForTeamFlags = function(username, email, callback) {
    connection("user", (db) => {
        db.collection("teamFlag").findOne({ username: username, email: email}, function (err, doc) {
            if (err) throw err;
            callback(doc);
            db.close();
        });
    });
};


module.exports = teamModel;