var migrate = require('../schema/migrate')
	, schema = require('../schema/schema')
	, df = require('../lib/date');

exports.resolveIssueData = function(param, req, res) {
	console.log('repoName router called');
	var repoHistory;
	var issueNumbers = [];
	nameParam = param;
	schema.getHistory(nameParam, function(data){
  		repoHistory = data;

  		for(var i = 0; i < data.length; i++){

			historyArr = data[i].date.split(' = '); 
			partDate = historyArr[0].substring(0, 10);

			newDate = df.dateFormatDash(partDate, 'M', function(format){
			var dateValue = new Date(format);
			newDateFormat = dateValue.toDateString();
			
			issueNumbers[i] = data[i].issues;
			repoHistory[i] = newDateFormat;

    	});
		}
  	});

 	schema.getRecord(nameParam, function(doc){

		var commitUrl = doc.commits_url.toString();
    	var newCommitStr = commitUrl.replace("{\/sha}", "");

    	var issUrl = doc.issues_url.toString();
    	var issueURLStr = issUrl.replace("{\/number}", "");

    	
 		res.render('repo-data',{
 			name: doc.name,
 			watchers: doc.watchers_count,
			creation: doc.created_at,
			description: doc.description,
			forksNo: doc.forks_count,
			openIssues: doc.open_issues,
			issuesUrl: issueURLStr,
			commitsUrl: newCommitStr,
			history: repoHistory,
			issuesTrend: issueNumbers
 	    });
	}); 
}

exports.resolveIssueDates = function(param, req, res) {

	nameParam = param;
	schema.getIssueDates(nameParam, res, nameParam, function(doc, teamName){
		res.render('issue-data', {name: teamName, date: doc})
	}); 
	console.log('issues router called');
}