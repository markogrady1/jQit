var async = require("async")
    , mongoClient = require("mongodb").MongoClient
    , teamModel = require('../models/teamsModel');

var team = {};


function JSONToArray(teamLocation, teamname, count, teamRepos) {
    'use strict';
    var teams = require("../repoData/" + teamLocation);
    for (let i in teams) {
        if (teamname === teams[i].team) {
            for (let j in teams[i].responsibility) {
                count++;
                var repo = teams[i].responsibility[j];
                teamRepos.push(repo);
            }
        }
    }
    return teamRepos;
}

team.getTeamData = function(teamname, dbase, isContentTeam, req, res, callback) {

    var totalData = [];
    var count = 0;
    var teamRepos = [];
    var teamLocation = isContentTeam ? "content_team.json" : "teams.json";
    var repoArr = JSONToArray(teamLocation, teamname, count, teamRepos);

    teamModel.getTeamRepoData(repoArr, dbase, (totalData) => {
        callback(totalData);
    });
};

team.getTeamRecord = function(teamname, isContentTeam, dbase, callback) {
    'use strict';
    var totalData = [];
    var teamLocation = isContentTeam ? "content_team.json" : "teams.json";
    var count = 0;
    var teamRepos = [];
    var teams = require("../repoData/" + teamLocation);
    for (let i in teams) {
        if (teamname  === teams[i].team) {
            for (let j in teams[i].responsibility) {
                count++;
                var repo = teams[i].responsibility[j];
                teamRepos.push(repo);
            }
        }
    }

    teamModel.getTeamRepoRecord(teamRepos, dbase, (totalData) => {
        callback(totalData);
    });
};


team.checkForTeamFlags = function(name, email, nameParam, callback) {
    teamModel.checkForFlaggedTeam(name, email, nameParam, (flagData) => {
        flagInfo = flagData === null ? "" : flagData;
        callback(flagData);
    });
};

team.checkForContentTeamFlags = function(name, email, nameParam, callback) {
    teamModel.checkForFlaggedContentTeam(name, email, nameParam, (flagData) => {
        flagInfo = flagData === null ? "" : flagData;
        callback(flagData);
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

team.getChartColour = function(username, email, cb) {
    connection("user", (db) => {
        var c, ec;
        db.collection('chartColor').findOne({ username: username, email: email }, function(err, doc) {
            if (err) throw err;
            if(doc === null) {
                cb("#4E87B2", "#c6dbef");
            } else {
                if(doc.chart_colour === "null") {
                    c = "#4E87B2";
                } else {

                    c = doc.chart_colour;
                }
                if(doc.end_chart_colour === "null") {
                    ec = "#c6dbef";
                } else {

                    ec = doc.end_chart_colour;
                }
                cb(c, ec);
            }
            db.close();
        });
    });
}

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

team.getTeamTargetValue = function(teamWatchTarget) {
    return teamWatchTarget === "Watch" ? null : teamWatchTarget;
};


module.exports = team;