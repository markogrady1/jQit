var schema = require("../schema/schema")
	, gitReq = require("github-request")
	, fs = require("fs")
	, df = require("../lib/date")
	, helper = require("../lib/helper")
	, auth = require("../config/auth")
	, _ = require("lodash")
	, async = require("async")
	,color = helper.terminalCol();

// condition to check if local-server storage has been set already
if (typeof localStorage === "undefined" || localStorage === null) {
	var LocalStorage = require("node-localstorage").LocalStorage;
	localStorage = new LocalStorage("./scratch");
}
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
var username = "Login with github";

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
	fs.readFile("./repoData/repo_" + target + "_history.txt","UTF-8", (err, data) => {
		if(err) throw err;
		var pullsData = [];
		repoChunk = helper.getSplitValue(data,"*");
		pullsData = self.formatPRs(repoChunk);
		callback(pullsData)
	});
};

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
		repoDt = helper.getSplitValue(chunk[i],",");
	}
	for (var k = 1; k < repoDt.length; k++) {
		s = repoDt[k].replace("\n", "");
		pullsData.push(s);
	}
	return pullsData;
};


/**
 *
 * @param db
 * @param target
 * @param teams
 * @param callback
 */
resolve.getNextIssueMonth = function(repo, range, callback) {
	this.getNextMonthHistoryQuery("repoHistory", "issues", repo, (obj) => {
		fullDateRaw = obj.raw;
		chartData = obj.chart;
		issueNumbers = obj.numbers;
		repoHistory = obj.historyData;
		callback(obj)
	}, range);
};
/**
 *
 * @param db
 * @param target
 * @param teams
 * @param callback
 */
resolve.getNextPullsMonth = function(repo, range, callback) {
	this.getNextMonthHistoryQuery("repoPullsHistory", "pulls", repo, (obj) => {
		pullRaw = obj.raw;
		pullChartData = obj.chart;
		pullNumbers = obj.numbers;
		repoPullHistory = obj.historyData;
		callback(obj)
	}, range);
};

/**
 * Responsible for resolving all of the issue data
 * from database for a given repository. It will then be sent to view
 *
 * @param {String} param
 * @param {Object} req
 * @param {Object} res
 */
resolve.resolveIssueData = function(param, req, res, io) {
	helper.noCache(res);
	io.emit("start")

	//LOGIN STATE
	var avaNum = this.getAvatarImage();
	var c = helper.getRandomString();
	var urlstate = "client_id=" + auth.github_client_id.toString() + "&state=" + c + "";
	localStorage.setItem("state", c);//this line is responsible for writing to local server storage for token access
	nameParam = param;

	//GLOBAL ARRAYS
	allRepoHistory = [];
	allRepoPullsHistory = [];
	var flagInfo = {};
	var fullDateRaw = [],createAtSeconds =[], pullRaw = [], newIssueUrl = null, oldIssueUrl = null, chartData = [], pullChartData = [], repoHistory = [],repoPullHistory = [], issueNumbers = [], pullNumbers = [];
	var result, pullRequestNo, events, newRange;
	var name = null;
	var email = null;

	var userData = this.getStorage();
	function getFlagData(callback){
		if (userData !== "undefined") {
			res.locals.userStat = true;
			name = userData.split("=>")[0];
			email = userData.split("=>")[2];
			schema.checkForFlaggedRepo(name, email, nameParam, (flagData) => {
				flagInfo = flagData === null ? "" : flagData;
				callback(flagData);
			});
		} else {
			res.locals.userStat = false;
			callback(null);
		}
	}


	var getIssueHistory = function(dataVal) { allRepoHistory = dataVal;	};

	var getPullsHistory = function(dataVal) { allRepoPullsHistory = dataVal; };

	getCompleteHistory("repoHistory", getIssueHistory);

	getCompleteHistory("repoPullsHistory", getPullsHistory);

	eventsData(param, function(ev){
		events = ev;
		result = { };
		var index = -1;
		while(++index < events.length) {
			if (!result[events[index].user])
				result[events[index].user] = 0;
			++result[events[index].user];
		}
	});

	this.getHistoryQuery("repoPullsHistory", "pulls", param, (obj) => {
		pullRaw = obj.raw;
		pullChartData = obj.chart;
		pullNumbers = obj.numbers;
		repoPullHistory = obj.historyData;
	});

	this.getHistoryQuery("repoHistory", "issues", param, (obj) => {
		fullDateRaw = obj.raw;
		chartData = obj.chart;
		issueNumbers = obj.numbers;
		repoHistory = obj.historyData;
	});

	schema.executeQuery("repoPullsHistory", nameParam,  (pullDoc) => {
		pullRequestNo = pullDoc[pullDoc.length-1].pulls;
	});

	schema.executeQuery("pulls", nameParam,  (pullDoc) => {
		pRange = getRange(pullDoc, false);
		averageAgeOfOpenPRs = getAverageAge(pullDoc);
	});

	schema.executeQuery("issues", nameParam,  (issDoc) => {

		_.map(issDoc, function(data){
			var dateString = new Date(data.created_at);
			createAtSeconds.push(dateString/1000)
		});

		getIssueRangeURL(createAtSeconds, issDoc, true, (newestIssue) => {
			newIssueUrl = newestIssue;
		});

		getIssueRangeURL(createAtSeconds, issDoc, false, (oldestIssue) => {
			oldIssueUrl = oldestIssue;
		});

		newRange = getRange(issDoc, true);

		console.log("open issues/pulls combined: " + issDoc.length);
		issNo = issDoc.length;
		timeString = getRange(issDoc, false);
		averageAgeOfOpenIssues = getAverageAge(issDoc);
	});

	var clIssues = "";
	schema.getRecord(nameParam, (doc) => {
		var urls = {
			commits: doc.commits_url.toString().replace("{\/sha}", ""),
			issues: doc.issues_url.toString().replace("{\/number}", "")
		};

		this.getClosedIssueNo(nameParam, (closedNumber) => {
			clIssues = closedNumber[closedNumber.length-1].issues;
		});

		this.getClosedNo(nameParam, (pullClosedNumber, pullDat, issueClosedNumber, issueDat) => {

			var pullTimeString = "";
			var issueTimeString = "";
			this.getTimeString(pullDat, (time) => {

				pullTimeString = time;
			});

			this.getTimeString(issueDat, (time) => {

				issueTimeString = time;
			});

			var repoData = dataCache.length > 0 ? dataCache : schema.completeDoc;

			pullTimeString = pullTimeString.charAt(0) == "N" ? "0 Days" : pullTimeString;
			issueTimeString = issueTimeString.charAt(0) == "N" ? "0 Days" : issueTimeString;
			getFlagData((flagdata) => {
				res.render("repo-data",{
					data: doc,
					created: doc.created_at.split("T")[0],
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
					issueRange: timeString,
					averageAgeOfOpenPRs:averageAgeOfOpenPRs,
					averageAgeOfOpenIssues: averageAgeOfOpenIssues,
					newRange: newRange,
					fullDate: fullDateRaw,
					fullPullDate: pullRaw,
					repoData: repoData,
					allRepoHistory: allRepoHistory,
					allRepoPullsHistory: allRepoPullsHistory,
					oldIssueUrl: oldIssueUrl = oldIssueUrl !== undefined ?  oldIssueUrl : null,
					newIssueUrl: newIssueUrl = newIssueUrl !== undefined ?  newIssueUrl : null,
					username: name,
					email: email,
					flagData:flagdata,
					urlstate: urlstate,
					state: c,
					header: nameParam,
					avatar_url: doc.owner.avatar_url,
					logoutLink: "../../logout",
					av: avaNum,
					dashboardLink: "../../dashboard"

				});
			})

		})
	});
};

/**
 * Responsible for resolving object from schema containing history for a given repository
 *
 * @param {String} database
 * @param {String} target
 * @param {String} param
 * @param {Function} callback
 * @param {Number} range
 */
resolve.getHistoryQuery = function(database, target, param, callback, range) {
	var numbers = [], historyData = [], jsonData = [], raw = [];
	schema.executeQuery(database, param, (data) => {
		var index = -1;
		while(++index < data.length) {
			getDateFormat(data, index, target, (dat, history, day) => {
				numbers.push(dat);
				historyData.push(history);
				var temp = {};
				temp["date"] = day;
				temp[target] = parseInt(dat);
				jsonData.push(temp);
				raw[index] = data[index].rawDate;
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
	}, range);
};


resolve.getNextMonthHistoryQuery = function(database, target, param, callback, range) {
	var numbers = [], historyData = [], jsonData = [], raw = [];
	schema.executeNextMonthQuery(database, param, (data) => {
		var index = -1;
		while(++index < data.length) {
			getDateFormat(data, index, target, (dat, history, day) => {
				numbers.push(dat);
				historyData.push(history);
				var temp = {};
				temp["date"] = day;
				temp[target] = parseInt(dat);
				jsonData.push(temp);
				raw[index] = data[index].rawDate;
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
	}, range);
};

/**
 * Retrieves a string containing length of time in readable format
 *
 * @param {Object} doc
 * @param {Function} callback
 */
resolve.getTimeString = function(doc, callback) {
	var timeScale = 0;
	var index = -1;
	while(++index < doc.length) {
		var isDiff = df.timeFormat(true);
		isDiff(doc[index].created_at, doc[index].closed_at, (pVal) => {
			timeScale += pVal;
		});
	}

	var timeString = "";
	pDiff = timeScale / doc.length;
	var notDiff = df.timeFormat(false);
	notDiff(pDiff, null, (pval) => {
		timeString = pval;
	});

	callback(timeString)
};

/**
 * This function resolves the URL for oldest or newest added issue
 *
 * @param {Array} createAtSeconds
 * @param {Array} issDoc
 * @param {Boolean} isNewest
 * @param {Function} callback
 */
var getIssueRangeURL = function(createAtSeconds, issDoc, isNewest, callback) {
	var index = -1;
	if(isNewest) {
		mnx = _.max(createAtSeconds);
	} else {
		mnx = _.min(createAtSeconds);
	}

	while(++index < createAtSeconds.length) {
		if(mnx === createAtSeconds[index])
			break;
	}
	var issueUrl;
	if(issDoc[index] !== undefined) {
		issueUrl = issDoc[index].html_url;
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
};

/**
 * Responsible for obtaining a given repositories date of issues
 *
 * @param {String} param
 * @param {Object} req
 * @param {Object} res
 */
resolve.resolveIssueDates = function(param, req, res) {
	nameParam = param;
	var av = getAvatarImage();
	schema.executeQuery("issues", nameParam, (doc, teamName) => {
		res.render("issue-data", {
			name: teamName,
			date: doc,
			urlstate: null,
			header: "Issue Information",
			avatar_url: null
		})
	});
	console.log("issues router called");
};

/**
 * Responsible for obtaining a given repositories entire issue history
 *
 * @param {String} target
 * @param {Function} fn
 */
var getCompleteHistory = function(target, callback) {
	schema.getAllHistory(target, schema.completeDoc, (complete) => {
		callback(complete);
	});
};

/**
 * Responsible for resolving all of the events
 * from database for a given repository
 *
 * @param {String} param
 * @param {Function} callback
 */
function eventsData(param, callback){
	schema.executeQuery("events", param, (d) => {
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
	N = [];
	repoHist = [];
	var dStr = data[index].rawDate.split("T")[0];
	day = dStr.split("-")[2];
	newDate = df.dateFormatDash(dStr, "B", (format) => {
		N[index] = trgt == "issues" ?
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
 * @param {Function} callback
 */
resolve.getClosedIssueNo = function(nameParam, callback) {
	schema.executeQuery("repoClosedIssueHistory", nameParam, (closedIssueDoc) => {

		callback(closedIssueDoc);
	});
}

/**
 * Responsible for obtaining the total number of closed pull requests for a given repository
 *
 * @param {String} nameParam
 * @param {Function} callback
 */
resolve.getClosedNo = function(nameParam, callback) {
	schema.executeQuery("repoClosedPullsHistory", nameParam, (closedPullDoc) => {
		schema.executeQuery("issuesClosed", nameParam, (closedIssueDoc) => {
			console.log("closed Issues/pulls combined " + closedIssueDoc.length);
			closedIssueNo = closedIssueDoc.length;

			callback(closedPullDoc[closedPullDoc.length-1].pulls, closedPullDoc, closedIssueDoc.length, closedIssueDoc);
		});
	});
}

/**
 * This function returns the range of a date in readable format
 *
 * @param {Array} pullDoc
 * @param {Boolean} isNewest
 * @return {String | Number} range
 */
function getRange(pullDoc, isNewest) {
	openPulls = pullDoc;
	var rangeArr = [];
	var index = -1;
	while(++index < openPulls.length) {
		var d = new Date(openPulls[index].created_at);
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
	rangeStr(range, null, (rng) => {
		range = rng;
	});
	range = range.charAt(0) === "-" ? "0 Days" : range;
	range = range === "Infinity days NaN hours NaN minutes NaN seconds" ? "N/A" : range;
	return range;
}


/**
 * This function returns the average age of a date in readable format
 *
 * @param {Array} pullDoc
 * @param {Boolean} isNewest
 * @return {String | Number} range
 */
function getAverageAge(pullDoc) {
	openPulls = pullDoc;

	var averageTimeOfOpenIssues = 0;
	var index = -1;
	while(++index < openPulls.length) {
		var d = new Date(openPulls[index].created_at);
		var now = new Date();
		var r = (now - d) / 1000;
		averageTimeOfOpenIssues += r;
	}
	averageTimeOfOpenIssues = averageTimeOfOpenIssues / openPulls.length;


	rangeStr = df.timeFormat(false);
	rangeStr(averageTimeOfOpenIssues, null, (rng) => {
		newAvgTimeString = rng;
	});

	newAvgTimeString = newAvgTimeString.charAt(0) === "-" ? "0 Days" : newAvgTimeString;
	newAvgTimeString = newAvgTimeString === "Infinity days NaN hours NaN minutes NaN seconds" ||
	newAvgTimeString === "NaN days NaN hours NaN minutes NaN seconds" ?
		"N/A" : newAvgTimeString;

	return newAvgTimeString;
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
	res.render("login", {
		login: "login with github username "+ uname	,
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
resolve.initiateRegistration = function(req, res, state, obj, io) {
	var data = localStorage.getItem("data");
	var name = data.split("=>")[0];
	var email = data.split("=>")[2];
	var avatar = data.split("=>")[1];
	var avatNum;
	if(email === "null"){
		schema.checkForEmail(name, (result) => {
			email = result;
			if(email === false){
				helper.print(color['green'],"GitHub user: ", "Email blocked and first time login: Email requested.");
				io.emit("userStatus", { av: "" });
				res.render("register", {
					register: "We need your email address " + name	,
					username: name
				});
			} else {
				helper.print(color['green'],"GitHub user: ", "Email blocked, but acquired from previous login.");
				avatNum = helper.getSplitValue(avatar, "/", -1);
				res.end();
				res.redirect('/');
				io.emit("userStatus", { av: avatNum })
			}
		});
	} else {
		io.emit("userStatus", { av:"booo"})
		helper.print(color['green'],"GitHub user: ", "Email provided.");
		avatNum = helper.getSplitValue(avatar, "/", -1);
		schema.regUser(name, email, res, io);
	}
};

/**
 * Validates the data given by user
 *
 * @param {Object} req
 * @param {Object} res
 */
resolve.validateRegistration = function(req, res) {
	var username = req.body.username;
	var userEmail = req.body.email;

	if (username == "" || userEmail == "") {
		res.render("register", {register: "empty"});
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
	if(uemail === "" || password === "") {
		res.render("login", {login: "empty"});
	} else {
		schema.loginUser(uemail, password, res, (reslt, data) => {
			callback(reslt, data);
		});
	}
};

/**
 * This function checks whether there are any additions to new assignees
 * These assignees must be registered to receive updates
 *
 */
resolve.checkForAssigneeAddition = function() {
	var details;
	var userAssignee = [], repos = [];
	var index = 0;
	while(++index < 49) {
		var obj = require("../repoData/issues/open/" + index + "_issues");
		if(obj == ""){
			continue
		}
		var url = _.map(obj, (data) => { return data.url; });
		repos.push(helper.getSplitValue(url, "/", 5));
	}

	schema.checkForAssignee((data) => {
		details = data;
		_.map(details, (d) => {
			schema.checkForAssigneeMatch("issues", d.username, repos, (assigneeData) => {
				_.map(assigneeData, (user) => {
					////////// mailer not hooked up to work while still testing ////////////////
					mailer = require("./mailer")(user.assignee, d.email, user.title, user.html_url)
				})
			})
		})
	});
};

/**
 * This function acquires the user's flag settings from the schema module
 * @param {Object} userObj
 * @param {Function} callback
 */
resolve.getFlagData = function(userObj, callback) {

	var name = userObj.split("=>")[0];
	var email = userObj.split("=>")[2];
	var avatar = userObj.split("=>")[1];
	var avatNum = helper.getSplitValue(avatar, "/", -1);
	var flagData = schema.checkForFlags(name, email, (data) => {
		schema.checkForAttention(name, email, (attData) => {
			callback(data, attData);
		})
	});
};

/**
 * Store repository data
 * @param {Object} data
 */
resolve.cacheRepoData = function(data) {
	dataCache = data;
};

/**
 * function responsible for passing flag settings to the schema module
 * @param {Object} obj
 */
resolve.assignWatcher = function(obj) {
	schema.storeWatchData(obj);
};

/**
 * Function responsible for resetting the users details from server-local storage
 *
 */
resolve.resetStorage = function() {
	localStorage.setItem("data","");
};

/**
 * Function responsible for returning the users current login state
 * @returns {String}
 */
resolve.getStorage = function() {
	data = localStorage.getItem("data");
	return data === " " ? "undefined" : data;
};

/**
 * function responsible for resetting the users details from local-server storage
 * @returns {String}
 */
resolve.getAvatarImage = function() {
	var data = localStorage.getItem("data");
	if(data === " ") {
		return "undefined";
	} else {
		var avatar = data.split("=>")[1];
		avatNum = helper.getSplitValue(avatar, "/", -1);

		return avatNum;
	}
};

resolve.getStorageItem = function(index) {
	var data = localStorage.getItem("data");
	if(data === " ") {
		return "undefined";
	} else {
		return data.split("=>")[index];
	}
};
/**
 * function responsible for deleting the local-server storage
 */
resolve.removeLoggedInStatusofUser = function() {
	fs.writeFile("./scratch/data", " ", (err) => {
		if (err) throw err;
		console.log("User temp data removed");
	});
};

module.exports = resolve;