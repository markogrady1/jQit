var migrate = require('../schema/migrate')
	, schema = require('../schema/schema')
	, df = require('../lib/date');

exports.resolveIssueData = function(param, req, res) {
	console.log('repoName router called');
	var repoHistory = [];
	var issueNumbers = [];
	var closedPullRequestNo;
	var json = [];
	nameParam = param;
    
	schema.getHistory(param, function(data){
    
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

	schema.getOpenPullRequestData(nameParam,  function(pullDoc){
		console.log("open pull requests " + pullDoc.length);
		pullRequestNo = pullDoc.length;
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
				df.dateTimes(pullDat[i].created_at, pullDat[i].closed_at, function(pVal){
					pullTimeScale += pVal;
				});
			}

			for(var j in issueDoc){
				df.dateTimes(issueDat[j].created_at, issueDat[j].closed_at, function(iVal){
					issueTimeScale += iVal;
				});
			}
				

			pullTimeString = '';
			pDiff = pullTimeScale / pullDoc.length;
			df.dateTimes(pDiff, null, function(pval){
					pullTimeString = pval;
			});

			issueTimeString = '';
			iDiff = issueTimeScale / issueDoc.length;
			df.dateTimes(iDiff, null, function(ival){
					issueTimeString = ival;
			});

			pullTimeString = pullTimeString.charAt(0) == 'N' ? '0 Days' : pullTimeString;
			issueTimeString = issueTimeString.charAt(0) == 'N' ? '0 Days' : issueTimeString;

			res.render('repo-data',{
	 			data: doc,
	 			url: urls,
				history: repoHistory,
				issuesTrend: issueNumbers,
				pullRequestNo: pullRequestNo,
				closedPulls: pullClosedNumber,
				closedissues: issueClosedNumber,
				ch: JSON.parse(chartData),
				avgPulls: pullTimeString,
				avgIssues: issueTimeString
	 	    });
		})
	}); 
}


exports.resolveIssueDates = function(param, req, res) {

	nameParam = param;
	schema.getIssueDates(nameParam, res, nameParam, function(doc, teamName){
		res.render('issue-data', {name: teamName, date: doc})
	}); 
	console.log('issues router called');
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
	schema.getClosedPullRequestData(nameParam, function(closedPullDoc){
		
		schema.getClosedIssuesData(nameParam, function(closedIssueDoc){
			console.log("closed Issues " + closedIssueDoc.length);
			closedIssueNo = closedIssueDoc.length;
			cb(closedPullDoc.length, closedPullDoc, closedIssueDoc.length, closedIssueDoc);
		});
	});		
}
