var notificationModel = require("../models/notificationModel"),
    teamModel = require("../models/teams"),
    async = require("async"),
    mailer = require("../lib/mailer");


var trackerNotif = {};

trackerNotif.getUserDetails = function() {
    var userFlagData = [];
    notificationModel.getAllUsers((userData) => {




        async.each(userData, function(item, callback){
            var username = item.username;
            var email = item.email;
            notificationModel.getEmailNotifs(username, email, (userEmailNotifs) => {
                if(userEmailNotifs.length !== 0) {
                //    console.log(userEmailNotifs.length)
                    userFlagData.push(userEmailNotifs);
                }
                callback();
            });

        }, function(err) {

            //setTimeout(() => {
                //callback(totalData);
                console.log(userFlagData);
            if(userFlagData.length > 0) {
                trackerNotif.checkForRepoIncrease(userFlagData[0]);
            }

            //}, 100);
        });



trackerNotif.checkForRepoIncrease = function(flagData) {

    var targetData = [];
    async.each(flagData, function(item, callback){
        var data = {};

        data.target = item.repository_target;
        data.username = item.username;
        data.email = item.email;
        console.log(data.target)
        notificationModel.getRepoIssueHistory(data.target, (issueHistory) => {
            data.lastIssue = issueHistory[issueHistory.length-1].issues;
            data.secondlastIssue = issueHistory[issueHistory.length-2].issues;
            notificationModel.getRepoPullsHistory(data.target, (pullsHistory) => {
                data.lastPR = pullsHistory[pullsHistory.length-1].pulls;
                data.secondlastPR = pullsHistory[pullsHistory.length-2].pulls;
                targetData.push(data);
                callback();
            });
        });

    }, function(err) {
        console.log(targetData)
        //setTimeout(() => {
        //callback(totalData);
        //console.log(userFlagData);
        //this.getBoundaryData(userFlagData);
        //}, 100);
    });


}











        //for(var i in userData) {
        //    var username = userData[i].username;
        //    var email = userData[i].email;
        //    notificationModel.getEmailNotifs(username, email, (userEmailNotifs) => {
        //        console.log(userEmailNotifs);
        //    });
        //
        //}
        //


    });
};


module.exports = trackerNotif;