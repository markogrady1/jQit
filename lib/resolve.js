var schema = require('../schema/schema')
	, gitReq = require('github-request')
	, fs = require('fs')
	, df = require('../lib/date')
	, helper = require('../lib/helper')
	, _ = require('underscore');

/**
 * Resolve object
 * 
 * @var {Object} resolve
 */
var resolve = {};

/**
 * Contains the details of user for email update
 * 
 * @var {Object} mailer
 */
var mailer;

/**
 * User Status
 * 
 * @var {String} username
 */
var username = 'Login with github'

/**
 * Caching of all repository data
 * 
 * @var {Array} 
 */
var dataCache = [];

/**
 * Responsible for resolving all of the pull request history 
 * from database for a given repository
 * 
 * @param {String} target
 * @param {Function} callback
 */
resolve.getPRs = function(target, callback) {
	var self = this;
	fs.readFile('./repoData/repo_' + target + '_history.txt','UTF-8', function(err, data){
    if(err) throw err;
    	var pullsData = [];
	      	repoChunk = helper.getSplitValue(data,'*');
	      	pullsData = self.formatPRs(repoChunk);
			callback(pullsData)
	});
}

/**
 * Function for splitting pull requests into repo names
 * 
 * @param {Array} chunk
 * @return {Array} pullsData
 */
resolve.formatPRs = function(chunk) {
	var repoDt;
	var pullsData = [];
	for (var i = chunk.length-1; i < chunk.length; i++) {
		repoDt = helper.getSplitValue(chunk[i],',');
	}
	for (var k = 1; k < repoDt.length; k++) {
		s = repoDt[k].replace('\n', '')
		pullsData.push(s);
	}
	return pullsData;
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
	var min, newRange;
	var fullDateRaw = [],createAtSeconds =[], pullRaw = [], newIssueUrl = null, oldIssueUrl = null, chartData = [], pullChartData = [], repoHistory = [],repoPullHistory = [], issueNumbers = [], pullNumbers = [], json = [], jsonPull = [];
	var events, closedPullRequestNo;
	nameParam = param;
	var result, range, pullRequestNo;

	var getIssueHistory = function(dataVal) { allRepoHistory = dataVal;	};

	var getPullsHistory = function(dataVal) { allRepoPullsHistory = dataVal; };

	getCompleteHistory('repoHistory', getIssueHistory);

	getCompleteHistory('repoPullsHistory', getPullsHistory);

    eventsData(param, function(ev){
		events = ev;
		result = { };
		for (i = 0; i < events.length; ++i) {
	    	if (!result[events[i].user])
	       		result[events[i].user] = 0;
	   		++result[events[i].user];
		}
    });

    getHistoryQuery('repoPullsHistory', 'pulls', param, function(obj) {
		pullRaw = obj.raw;
		pullChartData = obj.chart;
		pullNumbers = obj.numbers;
		repoPullHistory = obj.historyData; 
    });   

    getHistoryQuery('repoHistory', 'issues', param, function(obj) {
		fullDateRaw = obj.raw;
		chartData = obj.chart; 
		issueNumbers = obj.numbers;
		repoHistory = obj.historyData; 
    });
 
	schema.executeQuery('repoPullsHistory', nameParam,  function(pullDoc){
		pullRequestNo = pullDoc[pullDoc.length-1].pulls;
	});

	schema.executeQuery('pulls', nameParam,  function(pullDoc){
		pRange = getRange(pullDoc, false);
	});
	
	schema.executeQuery('issues', nameParam,  function(issDoc){
		_.map(issDoc, function(data){
			var dateString = new Date(data.created_at);
			createAtSeconds.push(dateString/1000)
		});

		getIssueRangeURL(createAtSeconds, issDoc, true, function(newestIssue) {
			newIssueUrl = newestIssue;
		});

		getIssueRangeURL(createAtSeconds, issDoc, false, function(oldestIssue) {
			oldIssueUrl = oldestIssue;
		});

		newRange = getRange(issDoc, true);
		
		console.log("open issues: " + issDoc.length);
		issNo = issDoc.length;
		iRange = getRange(issDoc, false);
	});

	var clIssues = '';
 	schema.getRecord(nameParam, function(doc){
    	var urls = {
    		commits: doc.commits_url.toString().replace("{\/sha}", ""),
    		issues: doc.issues_url.toString().replace("{\/number}", "")
    	};

    	getClosedIssueNo(nameParam, function(closedNumber){
    		clIssues = closedNumber[closedNumber.length-1].issues;
    	});

    	getClosedNo(nameParam, function(pullClosedNumber, pullDat, issueClosedNumber, issueDat){
			var pullTimeString = '';
			var issueTimeString = '';
			getTimeString(pullDat, function(time) {
    			pullTimeString = time;
    		});

    		getTimeString(issueDat, function(time) {
    			issueTimeString = time;
    		})
			
			var repoData = dataCache.length > 0 ? dataCache : schema.completeDoc;

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
				newRange: newRange,
				fullDate: fullDateRaw,
				fullPullDate: pullRaw,
				repoData: repoData,
				allRepoHistory: allRepoHistory, 
				allRepoPullsHistory: allRepoPullsHistory, 
				oldIssueUrl: oldIssueUrl = oldIssueUrl !== undefined ?  oldIssueUrl : null,
				newIssueUrl: newIssueUrl = newIssueUrl !== undefined ?  newIssueUrl : null,
				urlstate: null,
				username: username
	 	    });
		})
	}); 
}

/**
 * Responsible for resolving object from schema containing history for a given repository
 * 
 * @param {String} database
 * @param {String} target
 * @param {String} param
 * @param {Function} callback
 */
var getHistoryQuery = function(database, target, param, callback) {
	var numbers = [], historyData = [], jsonData = [], raw = [];
	schema.executeQuery(database, param, function(data) {
    	for (var i = 0; i < data.length; i++) {
  			getDateFormat(data, i, target, function(dat, history, day){
  				numbers.push(dat);
				historyData.push(history);
				var temp = {};
    			temp['date'] = day;
    			temp[target] = parseInt(dat);
   			jsonData.push(temp);
			raw[i] = data[i].rawDate;
  			});
		}
		pullChartData = JSON.stringify(jsonData);
		var obj = {
			raw: raw,
			chart: pullChartData,
			numbers: numbers,
			historyData: historyData
		};

		callback(obj)
    });
}

/**
 * Retrieves a string containing length of time in readable format
 * 
 * @param {Object} doc
 * @param {Function} callback
 */
var getTimeString = function(doc, callback) {
	var timeScale = 0;
	for (var i in doc) {
		var isDiff = df.timeFormat(true);
		isDiff(doc[i].created_at, doc[i].closed_at, function(pVal){
			timeScale += pVal;
		});
	}

	var timeString = '';
	pDiff = timeScale / doc.length;
	var notDiff = df.timeFormat(false);
	notDiff(pDiff, null, function(pval){
		timeString = pval;
	});

	callback(timeString)		
}

/**
 * This function resolves the URL for oldest or newest added issue
 * 
 * @param {Array} createdAtSeconds
 * @param {Array} issDoc
 * @param {Boolean} isNewest
 * @param {Function} fn
 */
var getIssueRangeURL = function(createAtSeconds, issDoc, isNewest, callback) {
	if(isNewest) {
		mnx = _.max(createAtSeconds);
	} else {
		mnx = _.min(createAtSeconds);
	}
	
	for(ni= 0; ni < createAtSeconds.length; ni++) {
		if(mnx === createAtSeconds[ni])
			break;
	}
	var issueUrl;
	if(issDoc[ni] !== undefined) {
		issueUrl = issDoc[ni].html_url;
	}
	callback(issueUrl);
};

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
var getCompleteHistory = function(target, callback) {
	schema.getAllHistory(target, schema.completeDoc, function(complete){
		callback(complete);
	});
};

/**
 * Responsible for resolving all of the events
 * from database for a given repository
 * 
 * @param {String} param
 * @param {Function} cb
 */
function eventsData(param, callback){
	schema.executeQuery('events', param, function(d){
    	ev = d;
    	callback(ev);
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
	var dStr = helper.getSplitValue(data[index].rawDate,'T',  0);
	day = helper.getSplitValue(dStr, '-', 2);
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
function getClosedIssueNo(nameParam, callback) {
	schema.executeQuery('repoClosedIssueHistory', nameParam, function(closedIssueDoc){
		callback(closedIssueDoc);
	});
}

/**
 * Responsible for obtaining the total number of closed pull requests for a given repository
 * 
 * @param {String} nameParam
 * @param {Function} cb
 */
function getClosedNo(nameParam, callback) {
	schema.executeQuery('pullsClosed', nameParam, function(closedPullDoc){
		schema.executeQuery('issuesClosed', nameParam, function(closedIssueDoc){
			console.log("closed Issues " + closedIssueDoc.length);
			closedIssueNo = closedIssueDoc.length;
			callback(closedPullDoc.length, closedPullDoc, closedIssueDoc.length, closedIssueDoc);
		});
	});		
}

/**
 * This function returns the range of a date in readable format
 * 
 * @param {Array} pullDoc
 * @return {String | Number} range
 */
function getRange(pullDoc, isNewest) {
	openPulls = pullDoc;
	var rangeArr = [];
	for (var h in openPulls) {
		var d = new Date(openPulls[h].created_at);
		var now = new Date();
		var r = (now - d) / 1000;
		rangeArr.push(r);
	}
	if(isNewest) {
		range = Math.min.apply(Math, rangeArr);
	} else {
		range = Math.max.apply(Math, rangeArr);
	}
	rangeStr = df.timeFormat(false);
	rangeStr(range, null, function(rng) {
		range = rng;
	});
	range = range.charAt(0) === '-' ? '0 Days' : range;
	range = range === 'Infinity days NaN hours NaN minutes NaN seconds' ? 'N/A' : range;
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
	var name = helper.getSplitValue(data, '=>', 0)
	var email = helper.getSplitValue(data, '=>', 2)
	var avatar = helper.getSplitValue(data, '=>', 1)
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
				avatNum = helper.getSplitValue(avatar, '/', -1)
				console.log(avatNum)
				res.redirect('/?state=true&av=' + avatNum)
			}
		});
	} else {
		avatNum = helper.getSplitValue(avatar, '/', -1)
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
 * @param {Function} callback
 */
resolve.validateLogin = function(req, res, callback) {
	var uemail = req.body.email;
	var password = req.body.password;
	if(uemail === '' || password === '') {
		res.render('login', {login: 'empty'});
	} else {
		schema.loginUser(uemail, password, res, function(reslt, data) {
			callback(reslt, data);
		});
	}
}

/**
 * This function checks whether there are any additions to new assignees
 * These assignees must be registered to receive updates
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
	    repos.push(helper.getSplitValue(url, '/', 5));
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

resolve.cacheRepoData = function(data) {
	dataCache = data;
}

module.exports = resolve;