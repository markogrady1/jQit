var async = require("async")
    , mongoClient = require("mongodb").MongoClient;

var team = {};


team.getTeamData = function(teamname, dbase, req, res, callback) {
    'use strict';
    var totalData = [];
    var count = 0;
    var teamRepos = [];
    var teams = require("../teams.json");
    for (let i in teams) {
        if (teamname  === teams[i].team) {
            for (let j in teams[i].responsibility) {
                count++;
                var repo = teams[i].responsibility[j];
                teamRepos.push(repo);
            }
        }
    }

    var projection = getProjection(dbase);//not used currently
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

//team.getTeamData = function(db, typeOfRequest, team, callback) {
//    this.executeQuery(db, team, (data) => {
//        callback(data)
//    });
//
//};

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
team.executeQuery = function(database, param, callback) {
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


module.exports = team;