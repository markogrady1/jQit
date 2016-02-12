var migrate = require("../schema/repoMigrate")
	, schema = require("../schema/schema")
	, df = require("../lib/date")
	, helper = require("../lib/helper")
	, reslv = require("../lib/mainController")
	, express = require("express")
	, auth = require("../config/auth")
	, router = express.Router()
    , fs = require("fs")
    , color = helper.terminalCol();

// condition to check if local-server storage has been set already
if (typeof localStorage === "undefined" || localStorage === null) {
	  var LocalStorage = require("node-localstorage").LocalStorage;
	  localStorage = new LocalStorage("./scratch");
}

var app;
var acc = [];
console.log(color["cyan"],"Router Initialised.");

//route for the home page
router.get("/", function(req, res){
	var avaNum = reslv.getAvatarImage();
	migrate.repositoryMigrate();
	var prs, c;
	console.log(color["cyan"]+color["yellow"],"Router:"," GET /index");
    function getFlagData(callback) {
        if (avaNum !== "undefined") {
            var data = reslv.getStorage();
            reslv.getFlagData(data, (flagObj, att) => {
                callback(flagObj, att);
            });
        } else {
            callback(null)
        }
    }

    //inner function to retreive pull requests and insert them into complete repository data
    reslv.getPRs("pulls", function(pullsdata){
		c = helper.getRandomString();
		var urlstate = "client_id=" + auth.github_client_id.toString() + "&state=" + c + "";
		prs = pullsdata;
		compDoc = schema.completeDoc;
		localStorage.setItem("state", c);

	for(var i = 0; i < compDoc.length; i++){
      for(var k = prs.length-1; k >=0; k--){
        var name = prs[k].split("  ");
        if(compDoc[i].name == name[0])
          	compDoc[i].pulls = name[1];
      }
     }

     reslv.cacheRepoData(compDoc);
        // obtain any flags that may have been set and render the home page
        getFlagData((flag, att) => {

            res.render("index", {
                names: schema.names,
                issuesNo: schema.issues,
                completeDoc: compDoc,
                pullsNo: prs,
                urlstate: urlstate,
                state: c,
                header: "Main page",
                av: avaNum,
                dashboardLink: "dashboard",
                logoutLink: "logout",
                flagData:flag,
                attention: att
            })
		});
		io.emit("userStatus", { av: avaNum })
	});
});


//route for single repository data
router.get("/repo/details/:repoName?", function(req, res) {
    console.log(color["cyan"]+color["yellow"],"Router:"," GET /repo/details/:" + req.params.repoName);
  	var nameParam = null;
  	nameParam = req.params.repoName;
  	reslv.resolveIssueData(nameParam, req, res, io);
});

//route for single repository details
router.get("/repo/issue/details/:team?", function(req, res) {
    console.log(color["cyan"]+color["yellow"],"Router:"," GET /repo/issue/details/:" + req.params.repoName);
  	var nameParam = null;
  	nameParam = req.params.team;
  	reslv.resolveIssueDates(nameParam, req, res);
});


//route for login page ==> GET
router.get("/logins", function(req, res) {
    console.log(color["cyan"]+color["yellow"],"Router:"," GET /logins");
    query = require("url").parse(req.url, true).query;
    var state = query.state;
    var code = query.code;
    var localState = localStorage.getItem("state");
    var request = require("request");

    if (state === localState) {
        helper.print(color['cyan'],"Matched: ", localState + " TOKEN");
         request.post(
                "https://github.com/login/oauth/access_token?client_id=" + auth.github_client_id + "&client_secret=" + auth.github_client_secret + "&code=" + code, {
                    form: {
                        key: "value"
                    }
             },
             function(error, response, body) {
                 console.log(color['cyan']+color['yellow']+color['white'],"GET " , response.statusCode,": Oauth HTTP status code.");
                 if (!error && response.statusCode == 200) {

                     var section = body.split("&");
                     access_t = helper.getSplitValue(section[0], "=", 1);

                     var requestify = require("requestify");

                     requestify.get("https://api.github.com/user?access_token=" + access_t)
                         .then(function(response) {
                             acc = response.getBody();
                             reslv.resetStorage();
                             acc = setBodyValue(acc, res)
                             reslv.initiateRegistration(req, res, state, acc, this.io);
                         });
                 }
             }
         );
    }
});

//route for login page ==> GET
router.post("/login", function(req, res){
    console.log(color["cyan"]+color["yellow"],"Router:"," POST /login");
    username = req.body.username;
    	password = req.body.password;
	reslv.validateLogin(req, res, function(result, data){
		if(!result) {
    			res.redirect("/login");
		} else {
			req.session.username = data[0].username;
			app.locals.username = data[0].username;
			res.redirect("/");
		}
	});
});

router.post("/repo/details/attention", (req, res) => {
    var userAvatar = req.body.userAvatar;
    var username = req.body.username;
    var attentionTarget = req.body.attentionTarget;
    var email = req.body.email;
    schema.assignAttentionMarker(attentionTarget, username, email, userAvatar, (response) => {
        console.log(response)
    });
})
//route for the register page requests
router.get("/register", function(req, res) {
    console.log(color["cyan"]+color["yellow"],"Router:"," GET /register");
	reslv.initiateRegistration(req, res);
});

//route for posting the users email data
router.post("/register", function(req, res) {
    console.log(color["cyan"]+color["yellow"],"Router:"," POST /logins");
    reslv.validateRegistration(req, res);
});

//route for logging out
router.get("/logout", function(req, res) {
    console.log(color["cyan"]+color["yellow"],"Router:"," GET /logout");
    reslv.removeLoggedInStatusofUser();
	req.session.destroy();
	var localState = localStorage.setItem("state", "");
	app.locals.username = "";
	avatar = false;
	res.redirect("/");
});

//route for requesting the users dashboard
router.get("/dashboard", (req, res) => {
    console.log(color["cyan"]+color["yellow"],"Router:"," GET /dashboard");
    var avatar = reslv.getAvatarImage();
	if(avatar === "undefined") {
		res.redirect("/")
	} else {
		c = helper.getRandomString();
		var urlstate = "client_id=" + auth.github_client_id.toString() + "&state=" + c + "";
        function getFlagData(callback) {
            if (avatar !== "undefined") {
                var data = reslv.getStorage();
                reslv.getFlagData(data, (flagObj) => {
                    callback(flagObj);
                });
            } else {
                callback(null)
            }
        }
        compDoc = schema.completeDoc;
        getFlagData((flag) => {
            res.render("dashboard", {
                state: "true",
                av: avatar,
                header: "Dashboard",
                urlstate: urlstate,
                state: c,
                dashboardLink: "",
                compDoc: compDoc,
                logoutLink: "logout",
                flag: flag
            });
        })

	}
});

//route for posting the dashboard settings
router.post("/dashboard/edit", (req, res) => {
    console.log(color["cyan"]+color["yellow"],"Router:"," POST /dashboard/edit");
    var watchTarget = req.body.watchTarget;
    var receiveEmail = req.body.receiveEmail;
    var flagIssuesChart = req.body.flagIssuesChart;
    var flagPullsChart = req.body.flagPullsChart;

    var issueBoundary = req.body.issueSlider;
    var pullsBoundary = req.body.pullsSlider;
    var showEveryIncrease = req.body.showEveryIncrease;

    watchTarget = watchTarget === "Watch" ? null : watchTarget;

    var data = localStorage.getItem("data");
    var name = helper.getSplitValue(data, "=>", 0);
    var email = helper.getSplitValue(data, "=>", 2);
    var avatar = helper.getSplitValue(data, "=>", 1);
    avatNum = helper.getSplitValue(avatar, "/", -1);
    var watcher = {
        user: name,
        email: email,
        avatar: avatar,
        target: watchTarget,
        receiveEmailUpadate: receiveEmail,
        highlightissueschart: flagIssuesChart,
        highlightpullschart: flagPullsChart,
        issuesboundary: issueBoundary,
        pullsboundary: pullsBoundary,
        showEveryIncrease: showEveryIncrease

    };
    res.send("Data Received");

    reslv.assignWatcher(watcher);
});

//route for 404 requests
router.get("*", function(req, res) {
	res.end("<h1>you\"ve been 404\"d</h1>");
});

// function responsible for setting and returning the users GitHub details
var setBodyValue = function(body, res) {
	var bd = body;
	 localStorage.setItem("data","");
	 localStorage.setItem("data", bd.login + "=>" + bd.avatar_url + "=>" + bd.email + "")

	return  {
		"login": bd.login,
		"email": bd.email,
		"avatar_url": bd.avatar_url
	};
};

// return the router module
module.exports = function(appl, serv, io) {
	app = appl;
	this.io = io;
	app.locals.username = "";
	return router;
};
