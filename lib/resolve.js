var schema = require('../schema/schema')
	, gitReq = require('github-request')
	, fs = require('fs')
	, df = require('../lib/date')
	, helper = require('../lib/helper')
	, _ = require('underscore');

/**
 * Resolve object
 * 
 * {Object} resolve
 */
var resolve = {};

/**
 * Contains the details of user for email update
 * 
 * {Object} mailer
 */
var mailer;

/**
 * User Status
 * 
 * {String} username
 */
var username = 'Login with github'

/**
 * Responsible for resolving all of the pull request history 
 * from database for a given repository
 * 
 * @param {String} target
 * @param {Function} callback
 */
resolve.getPRs = function(target, callback) {
	fs.readFile('./repoData/repo_' + target + '_history.txt','UTF-8', function(err, data){
    if(err) throw err;
    	var pullsData = [];
	      	repoChunk = data.split('*');
	      	
		    for (var i = repoChunk.length-1; i < repoChunk.length; i++) {
		    	repoDt = repoChunk[i].split(',');
			}
			for (var k = 1; k < repoDt.length; k++) {
				s = repoDt[k].replace('\n', '')
				pullsData.push(s);
			}
			callback(pullsData)
	});
}

/**
 * Responsible for resolving all of the issue data
 * from database for a given repository. It will then be sent to view
 * 
 * @param {String} param
 * @param {Object} req
 * @param {Object} res
 */
resolve.resolveIssueData = function(param, req, res) {
	allRepoHistory = [];
	allRepoPullsHistory = [];
	var min;
	var fullDateRaw = [],createAtSeconds =[], pullRaw = [], oldIssueUrl = null, repoHistory = [],repoPullHistory = [], issueNumbers = [], pullNumbers = [], json = [], jsonPull = [];
	var events, closedPullRequestNo;
	nameParam = param;
	var result, range, pullRequestNo;
	var getIssueHistory = function(dataVal) { allRepoHistory = dataVal;	};
	var getPullsHistory = function(dataVal) { allRepoPullsHistory = dataVal; };
	getCompleteHistory('repoHistory', getIssueHistory);
	getCompleteHistory('repoPullsHistory', getPullsHistory);

	console.log('repoName router called');
	
    eventsData(param, function(ev){
		events = ev;
		result = { };
		for (i = 0; i < events.length; ++i) {
	    	if (!result[events[i].user])
	       		result[events[i].user] = 0;
	   		++result[events[i].user];
		}
    });

    schema.executeQuery('repoPullsHistory', param, function(data) {
    	for (var i = 0; i < data.length; i++) {
  			getDateFormat(data, i, 'pulls', function(pulls, history, day){
  				pullNumbers.push(pulls);
				repoPullHistory.push(history);
				var temp = {};
    			temp['date'] = day;
    			temp['pulls'] = parseInt(pulls);
   			jsonPull.push(temp);
			pullRaw[i] = data[i].rawDate;
  			});
		}
		pullChartData = JSON.stringify(jsonPull);
    });

	schema.executeQuery('repoHistory', param, function(data){
  		for (var i = 0; i < data.length; i++) {
  			getDateFormat(data, i, 'issues', function(issues, history, day){
  				issueNumbers.push(issues);
				repoHistory.push(history);
				var temp = {};
    			temp['date'] = day;
    			temp['issues'] = parseInt(issues);
   			json.push(temp);
			fullDateRaw[i] = data[i].rawDate;
  			});
		}
		chartData = JSON.stringify(json);
  	});

	schema.executeQuery('repoPullsHistory', nameParam,  function(pullDoc){
		pullRequestNo = pullDoc[pullDoc.length-1].pulls;
	});

	schema.executeQuery('pulls', nameParam,  function(pullDoc){
		pRange = getPullRequestRange(pullDoc);
	});
	
	schema.executeQuery('issues', nameParam,  function(issDoc){
		_.map(issDoc, function(data){
			var dateString = new Date(data.created_at);
			createAtSeconds.push(dateString/1000)
		});
		
		min = _.min(createAtSeconds);
		var mi;
		for(mi= 0; mi < createAtSeconds.length; mi++) {
			if(min === createAtSeconds[mi])
				break;
		}

		if(issDoc[mi] !== undefined) {
			oldIssueUrl = issDoc[mi].html_url;
		}

		console.log("open issues: " + issDoc.length);
		issNo = issDoc.length;
		iRange = getPullRequestRange(issDoc);
	});

	clIssues = '';
 	schema.getRecord(nameParam, function(doc){
    	var urls = {
    		commits: doc.commits_url.toString().replace("{\/sha}", ""),
    		issues: doc.issues_url.toString().replace("{\/number}", "")
    	};

    	getClosedIssueNo(nameParam, function(closedNumber){
    		clIssues = closedNumber[closedNumber.length-1].issues;
    	});

    	getClosedNo(nameParam, function(pullClosedNumber, pullDat, issueClosedNumber, issueDat){
			pullDoc = pullDat;
			issueDoc = issueDat;
			var pullTimeScale = 0,
			issueTimeScale = 0;
			
			for (var i in pullDoc) {
				var isDiff = df.timeFormat(true);
				isDiff(pullDat[i].created_at, pullDat[i].closed_at, function(pVal){
					pullTimeScale += pVal;
				});
			}

			for(var j in issueDoc){
				var isDiff = df.timeFormat(true);
				isDiff(issueDat[j].created_at, issueDat[j].closed_at, function(iVal){
					issueTimeScale += iVal;
				});
			}

			pullTimeString = '';
			pDiff = pullTimeScale / pullDoc.length;
			var notDiff = df.timeFormat(false);
			notDiff(pDiff, null, function(pval){
					pullTimeString = pval;
			});

			issueTimeString = '';
			iDiff = issueTimeScale / issueDoc.length;
			var notDiff = df.timeFormat(false);
			notDiff(iDiff, null, function(ival){
					issueTimeString = ival;
			});

			pullTimeString = pullTimeString.charAt(0) == 'N' ? '0 Days' : pullTimeString;
			issueTimeString = issueTimeString.charAt(0) == 'N' ? '0 Days' : issueTimeString;
			res.render('repo-data',{
	 			data: doc,
	 			header: 'Repo Information',
	 			url: urls,
				history: repoHistory,
				issuesTrend: issueNumbers,
				pullRequestNo: pullRequestNo,
				closedPulls: pullClosedNumber,
				closedissues: clIssues,
				ch: JSON.parse(chartData),
				chPull: JSON.parse(pullChartData),
				avgPulls: pullTimeString,
				avgIssues: issueTimeString,
				events: result,
				pullRange: pRange,
				issueRange: iRange,
				fullDate: fullDateRaw,
				fullPullDate: pullRaw,
				repoData: schema.completeDoc,
				allRepoHistory: allRepoHistory, 
				allRepoPullsHistory: allRepoPullsHistory, 
				oldIssueUrl: oldIssueUrl,
				urlstate: null,
				username: username
	 	    });
		})
	}); 
}

/**
 * This function prepares the URL path for obtaining github api details of a given repository
 * 
 * @param {String} param
 * @return {String} path
 */
var preparePath = function(param) {
	var path = "https://api.github.com/repos/jquery/" + param + "/events"
	return path;
}

/**
 * Responsible for obtaining a given repositories date of issues
 * 
 * @param {String} param
 * @param {Object} req
 * @param {Object} res
 */
resolve.resolveIssueDates = function(param, req, res) {
	nameParam = param;
	schema.executeQuery('issues', nameParam, function(doc, teamName){
		res.render('issue-data', {
			name: teamName,
			 date: doc,
			 urlstate: null,
			 header: 'Issue Information'
			})
	}); 
	console.log('issues router called');
}

/**
 * Responsible for obtaining a given repositories entire issue history 
 * 
 * @param {String} target
 * @param {Function} fn
 */
var getCompleteHistory = function(target, fn) {
	schema.getAllHistory(target, schema.completeDoc, function(complete){
		fn(complete);
	});
};

/**
 * Responsible for resolving all of the events
 * from database for a given repository
 * 
 * @param {String} param
 * @param {Function} cb
 */
function eventsData(param, cb){
	schema.executeQuery('events', param, function(d){
    	ev = d;
    	cb(ev);
    });
}

/**
 * Responsible for formatting the date of a given ISO formated date
 * 
 * @param {Array} data
 * @param {Number} index
 * @param {String} trgt
 * @param {Function} callback
 */
function getDateFormat(data , index, trgt, callback) {
	N = []
	, repoHist = [];
	var dStr = helper.getSplitValue(data[index].rawDate, 0, 'T');
	day = helper.getSplitValue(dStr, 2,'-');
	newDate = df.dateFormatDash(dStr, 'B', function(format){
		N[index] = trgt == 'issues' ?
		data[index].issues :
		data[index].pulls;
		repoHist[index] = format;
	});
    callback(N[index], repoHist[index], day)
}

/**
 * Responsible for obtaining the total number of closed issues for a given repository
 * 
 * @param {String} nameParam
 * @param {Function} cb
 */
function getClosedIssueNo(nameParam, cb) {
	schema.executeQuery('repoClosedIssueHistory', nameParam, function(closedIssueDoc){
		cb(closedIssueDoc);
	});
}

/**
 * Responsible for obtaining the total number of closed pull requests for a given repository
 * 
 * @param {String} nameParam
 * @param {Function} cb
 */
function getClosedNo(nameParam, cb) {
	schema.executeQuery('pullsClosed', nameParam, function(closedPullDoc){
		schema.executeQuery('issuesClosed', nameParam, function(closedIssueDoc){
			console.log("closed Issues " + closedIssueDoc.length);
			closedIssueNo = closedIssueDoc.length;
			cb(closedPullDoc.length, closedPullDoc, closedIssueDoc.length, closedIssueDoc);
		});
	});		
}

/**
 * This function returns the range of a date in readable format
 * 
 * @param {Array} pullDoc
 * @return {String | Number} range
 */
function getPullRequestRange(pullDoc) {
	openPulls = pullDoc;
	var rangeArr = [];
	for (var h in openPulls) {
		var d = new Date(openPulls[h].created_at);
		var now = new Date();
		var r = (now - d) / 1000;
		rangeArr.push(r);
	}
		
	maxRange = Math.max.apply(Math, rangeArr);
	maxRangeStr = df.timeFormat(false);
	maxRangeStr(maxRange, null, function(rng) {
		range = rng;
	});
	range = range.charAt(0) === '-' ? '0 Days' : range;
	return range;
}

/**
 * Prompts the user to login 
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {String} uname
 */
resolve.initiateLogin = function(req, res, uname) {	
	username = uname
	res.render('login', {
		login: 'login with github username '+ uname	,
		username: uname
	});
};

/**
 * This function is reponsible for sending the correct user data 
 * to the database to check if user already exists
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {String} state
 * @param {Object} obj
 */
resolve.initiateRegistration = function(req, res, state, obj) {
	console.log(obj.avatar_url)
	var data = localStorage.getItem('data')
	var name = helper.getSplitValue(data, 0, '=>')
	var email = helper.getSplitValue(data, 2, '=>')
	var avatar = helper.getSplitValue(data, 1, '=>')
	var avatNum;
	if(email === 'null'){
		schema.checkForEmail(name, function(result){
		email = result;
			if(email === false){
				res.render('register', {
					register: 'We need your email address '+ name	,
					username: name
				});
			} else {
				avatNum = helper.getSplitValue(avatar, -1, '/')
				console.log(avatNum)
				res.redirect('/?state=true&av=' + avatNum)
			}
		});
	} else {
		avatNum = helper.getSplitValue(avatar, -1, '/')
				console.log(avatNum)
		schema.regUser(name, email, res);
		res.redirect('/?state=true&av=' + avatNum)
	} 
}

/**
 * Validates the data given by user
 * 
 * @param {Object} req
 * @param {Object} res
 */
resolve.validateRegistration = function(req, res) {
	var username = req.body.username;
	var userEmail = req.body.email;
	
	if (username == '' || userEmail == '') {
		res.render('register', {register: 'empty'});
	} else {
		
			schema.regUser(username, userEmail, res);
		
	}
};

/**
 * Validates the data given by user
 * 
 * @param {Object} req
 * @param {Object} res
 * @param {Function} fn
 */
resolve.validateLogin = function(req, res, fn) {
	var uemail = req.body.email;
	var password = req.body.password;
	if(uemail === '' || password === '') {
		res.render('login', {login: 'empty'});
	} else {
		schema.loginUser(uemail, password, res, function(reslt, data) {
			fn(reslt, data);
		});
	}
}

/**
 * This function checks whether there are any additions to new assignees
 * These assignees must be registered to recieve updates
 * 
 */
resolve.checkForAssigneeAddition = function() {
	var details;
	var userAssignee = [], repos = [];
		for(var i = 1; i < 49; i++){
			var obj = require('../repoData/issues/open/' + i + "_issues");
			if(obj == ""){
				continue
			}
	    	var url = _.map(obj, function(data) {return data.url;})
		    repos.push(helper.getSplitValue(url, 5, '/'));
		}

	schema.checkForAssignee(function(data) {
		details = data;
		_.map(details, function(d) {
			schema.checkForAssigneeMatch('issues', d.username, repos, function(assigneeData) {
				_.map(assigneeData, function(user) {
					////////// mailer not hooked up to work while still testing ////////////////
					mailer = require('./mailer')(user.assignee, d.email, user.title, user.html_url)
				})
			})
		})
	});
}

module.exports = resolve;