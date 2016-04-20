var nodemailer = require('nodemailer')
    , auth = require('../config/auth')
    , CronJob = require('cron').CronJob
    , fs = require('fs')
    , helper = require('./helper')
    , MongoClient = require('mongodb').MongoClient;

var color = helper.terminalCol();
/**
 * Send email to users that are registered for updates
 *
 */

var mailer = {};

mailer.updateInformation = function() { //username and other parameters not used at moment still testing
    this.getDataOverTime('repoHistory', 'issue')
    this.getDataOverTime('repoPullsHistory', 'pulls')
};

/*  //////////keep this code for a scheduled nodeJS task that will access is email should be sent out///////////////////
 ////////////////////////////////////////////////////////////////////////////////////////*/
 new CronJob('*/30 * * * *', function() {
     mailer.updateInformation();
     trackerNotification = require('../lib/trackerNotification');
     trackerNotification.getUserDetails();

 }, null, true, "Europe/London");





mailer.getDataOverTime = function(database, target) {
    this.resetHistory(database);
    this.getHistoryFile(target, false, (err, data) => {
        if(err) throw err;
        this.connect(database, (db) => {
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
             setTimeout(function() {/////////////////////////////////////
             	db.close();
             }, 1000)
        });
    });
    helper.print(color['cyan'],"DATA MIGRATION", "- jquery open " + target + " updated");

};


mailer.getHistoryFile = function(target, closed, callback) {
    target = closed ? 'closed_' + target : 'repo_' + target;
    fs.readFile('./repoData/' + target + '_history.txt','UTF-8', function(err, data){
        callback(err, data);
    });
};
mailer.resetHistory = function(rep) {
    mailer.connect(rep, (db) => {
        db.dropDatabase();
        db.close();
    });
};


mailer.connect = function(dbase, callback) {
    MongoClient.connect("mongodb://127.0.0.1:27017/" + dbase, (err, db) => {
        if(err) throw err;
        callback(db);
    });
};

module.exports = mailer;