var migrate = require('../schema/migrate')
	, schema = require('../schema/schema')
	, gitReq = require('github-request')
	, df = require('../lib/date');

exports.resolveIssueData = function(param, req, res) {
	console.log('repoName router called');
	var repoHistory = [];
	var events;
	var issueNumbers = [];
	var closedPullRequestNo;
	var json = [];
	nameParam = param;
	var result, range;
    eventsData(param, function(ev){
		events = ev;

		result = { };
	for(i = 0; i < events.length; ++i) {
    		if(!result[events[i].user])
       			 result[events[i].user] = 0;
   			 ++result[events[i].user];
	}
    });

	schema.executeQuery('repoHistory', param, function(data){
    
  		for(var i = 0; i < data.length; i++){
  			getDateFormat(data, i, function(issues, history, day){
  				issueNumbers.push(issues);
				repoHistory.push(history);
				var temp = {};
    			temp['date'] = day;
    			temp['issues'] = parseInt(issues);
   				json.push(temp);
				
  			});
		}
		chartData = JSON.stringify(json);
  	});

	schema.executeQuery('pulls', nameParam,  function(pullDoc){
		console.log("open pull requests: " + pullDoc.length);
		pullRequestNo = pullDoc.length;
		pRange = getPullRequestRange(pullDoc);

	});

	schema.executeQuery('issues', nameParam,  function(issDoc){
		console.log("open issues: " + issDoc.length);
		issNo = issDoc.length;
		iRange = getPullRequestRange(issDoc);
	});

 	schema.getRecord(nameParam, function(doc){
    	var urls = {
    		commits: doc.commits_url.toString().replace("{\/sha}", ""),
    		issues: doc.issues_url.toString().replace("{\/number}", "")
    	};

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
			
				console.log(result);
			res.render('repo-data',{
	 			data: doc,
	 			header: 'Repo Information',
	 			url: urls,
				history: repoHistory,
				issuesTrend: issueNumbers,
				pullRequestNo: pullRequestNo,
				closedPulls: pullClosedNumber,
				closedissues: issueClosedNumber,
				ch: JSON.parse(chartData),
				avgPulls: pullTimeString,
				avgIssues: issueTimeString,
				events: result,
				pullRange: pRange,
				issueRange: iRange
	 	    });
		})
	}); 
}



var preparePath = function(param) {
	var path = "https://api.github.com/repos/jquery/" + param + "/events"
	return path;
}

exports.resolveIssueDates = function(param, req, res) {

	nameParam = param;
	schema.executeQuery('issues', nameParam, function(doc, teamName){
		res.render('issue-data', {
			name: teamName,
			 date: doc,
			 header: 'Issue Information'
			})
	}); 
	console.log('issues router called');
}


function eventsData(param, cb){
	schema.executeQuery('events', param, function(d){
    	ev = d;
    	cb(ev);
    });
}
function getDateFormat(data , index, callback) {
	issueN = []
	, repoHist = [];
	var dStr = data[index].rawDate.split('T');
	day = dStr[0].split('-');
	newDate = df.dateFormatDash(dStr[0], 'B', function(format){
		issueN[index] = data[index].issues;
		repoHist[index] = format;
	});
    callback(issueN[index], repoHist[index], day[2])
}

function getClosedNo(nameParam, cb) {
	schema.executeQuery('pullsClosed', nameParam, function(closedPullDoc){
		
		schema.executeQuery('issuesClosed', nameParam, function(closedIssueDoc){
			console.log("closed Issues " + closedIssueDoc.length);
			closedIssueNo = closedIssueDoc.length;
			cb(closedPullDoc.length, closedPullDoc, closedIssueDoc.length, closedIssueDoc);
		});
	});		
}

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


exports.initiateLogin = function(req, res) {
	
	res.render('login', {
		login: 'login rudeboy'	
});

};

exports.initiateRegistration = function(req, res) {
	res.render('register', {greet: 'hi reg'});
}

exports.validateRegistration = function(req, res) {
	var username = req.body.username;
	var userEmail = req.body.email;
	var regPass = req.body.password;
	var regConfirmPass = req.body.confirmpassword;
	if (username == '' || userEmail == '' || regPass  == '' || regConfirmPass == '' ) {
		return false;
	} else {
		if (regPass !== regConfirmPass) {
			return false;
		} else {
			schema.regUser(username, userEmail, regPass, res);
		}
	}
};

exports.validateUser = function(u, p) {
	name = 'mark';//temporary feature of course
	password = '123';
	//implement mongodb check for user credentials HERE//
	//start session feature HERE if all good
	if(name === u && password === p) {
		return true;
	}
}
