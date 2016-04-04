var nodemailer = require('nodemailer')
    , auth = require('../config/auth')
    , CronJob = require('cron').CronJob;

/**
 * Send email to users that are registered for updates
 * 
 * @param {String} username
 * @param {String} email
 * @param {String} title
 * @param {String} msgContent
 */
var mailer = module.exports = function(username, email, title, msgContent) { //username and other parameters not used at moment still testing

};

/*  //////////keep this code for switching cronjobs from PHP to nodeJS///////////////////
 ////////////////////////////////////////////////////////////////////////////////////////*/
 new CronJob('*/1 * * * *', function() {

     trackerNotification = require('../lib/trackerNotification');
     trackerNotification.getUserDetails();
 console.log('cron')
 }, null, true, "Europe/London");


