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
  			getDateFormat(data, i, function(issues, history){
  				issueNumbers.push(issues);
				repoHistory.push(history);

				date = history.split(' ');
   				cd = date[2]
				var temp = {};
    			temp['date'] = cd;
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

	// schema.getClosedIssuesData(nameParam, function(closedIssueDoc){
	// 	console.log("closed Issues " + closedIssueDoc.length);
	// 	closedIssueNo = closedIssueDoc.length;
	// });

 	schema.getRecord(nameParam, function(doc){
    	var urls = {
    		commits: doc.commits_url.toString().replace("{\/sha}", ""),
    		issues: doc.issues_url.toString().replace("{\/number}", "")
    	};

    	getClosedNo(nameParam, function(pullClosedNumber, pullDat, issueClosedNumber, issueDoc){
			pullDoc = pullDat;
		
			res.render('repo-data',{
	 			data: doc,
	 			url: urls,
				history: repoHistory,
				issuesTrend: issueNumbers,
				pullRequestNo: pullRequestNo,
				closedPulls: pullClosedNumber,
				closedissues: issueClosedNumber,
				ch: JSON.parse(chartData)
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
	issueN = [];
	repoHist = [];
	historyArr = data[index].date.split(' = '); 
	partDate = historyArr[0].substring(0, 10);

	newDate = df.dateFormatDash(partDate, 'M', function(format){
		var dateValue = new Date(format);
		newDateFormat = dateValue.toDateString();
		
		issueN[index] = data[index].issues;
		repoHist[index] = newDateFormat;
	
	});
    callback(issueN[index], repoHist[index])
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
