var migrate = require("../schema/repoMigrate")
	, schema = require("../schema/schema")
	, df = require("../lib/date")
	, helper = require("../lib/helper")
	, reslv = require("../lib/mainController")
	, express = require("express")
	, auth = require("../config/auth")
	, router = express.Router()
    , fs = require("fs");

if (typeof localStorage === "undefined" || localStorage === null) {
	  var LocalStorage = require("node-localstorage").LocalStorage;
	  localStorage = new LocalStorage("./scratch");
}

var app;
var acc = [];
console.log("router called");

//route for the home page
router.get("/", function(req, res){
	var avaNum = checkLoggedInStatusofUser();

	migrate.repositoryMigrate();
	var prs, c;
	console.log("index router called");
	reslv.getPRs("pulls", function(pullsdata){
		c = helper.getRandomString();
		var urlstate = "client_id=" + auth.github_client_id.toString() + "&state=" + c + ""
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
	res.render("index", {
		names: schema.names,
		issuesNo: schema.issues,
		completeDoc: compDoc,
		pullsNo: prs,
		urlstate: urlstate,
		state: c,
		header: "Main page",
		av: avaNum,
		dashLink: "dashboard"
		});
		io.emit("userStatus", { av: avaNum })
	});
});


//route for single repository data
router.get("/repo/details/:repoName?", function(req, res) {
	console.log("repoName router called");
  	var nameParam = null;
  	nameParam = req.params.repoName;	
  	reslv.resolveIssueData(nameParam, req, res);	
});

//route for single repository details
router.get("/repo/issue/details/:team?", function(req, res) {
	console.log("team issues router called");
  	var nameParam = null;
  	nameParam = req.params.team;
  	reslv.resolveIssueDates(nameParam, req, res);
});

function resolveDate(fullDate) {
	partDate = fullDate.split(" = ");

	return partDate[0];
}


//route for login page ==> GET
router.get("/logins", function(req, res) {
    
    query = require("url").parse(req.url, true).query;
    var state = query.state;
    var code = query.code;
    var localState = localStorage.getItem("state");
    var request = require("request");

    if (state === localState) {
        console.log(localState + " token is matched.")
            request.post(
                "https://github.com/login/oauth/access_token?client_id=" + auth.github_client_id + "&client_secret=" + auth.github_client_secret + "&code=" + code, {
                    form: {
                        key: "value"
                    }
                },
                function(error, response, body) {
                    console.log("outh status code",response.statusCode)
                    if (!error && response.statusCode == 200) {
                       
                        var section = body.split("&");
                        access_t = helper.getSplitValue(section[0], "=", 1);
                        
                        var requestify = require("requestify");

                        requestify.get("https://api.github.com/user?access_token=" + access_t)
                            .then(function(response) {
	                            acc = response.getBody();
	                            resetStorage();
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

router.get("/register", function(req, res) {
	console.log("register page called");
	reslv.initiateRegistration(req, res);
});

router.post("/register", function(req, res) {
	 reslv.validateRegistration(req, res);
});

router.get("/logout", function(req, res) {
	removeLoggedInStatusofUser();
	req.session.destroy();
	var localState = localStorage.setItem("state", "");
	app.locals.username = "";
	avatar = false;
	res.redirect("/");
});

router.get("/dashboard", (req, res) => {
	var avatar = checkLoggedInStatusofUser();
	if(avatar === "undefined") {
		res.redirect("/")
	} else {
		c = helper.getRandomString();
		var urlstate = "client_id=" + auth.github_client_id.toString() + "&state=" + c + ""
		res.render("dashboard", {
			state: "true",
			av: avatar,
			header: "Dashboard",
			urlstate: urlstate,
			state: c,
			dashLink: ""
		});
	}

});
//STATUS: 404 back-up
router.get("*", function(req, res) {
	res.end("<h1>you\"ve been 404\"d</h1>");
});


var setBodyValue = function(body, res) {
	var bd = body;

	 localStorage.setItem("data","");
	 localStorage.setItem("data", bd.login + "=>" + bd.avatar_url + "=>" + bd.email + "")
	

	var userDetails = {
		"login": bd.login,
		"email": bd.email,
		"avatar_url": bd.avatar_url
	};
 	
 	return userDetails;
};

module.exports = function(appl, serv, io) {
	app = appl;
	this.io = io;
	app.locals.username = "";
	return router;
};

function resetStorage() {
	localStorage.setItem("data","");
}

function checkLoggedInStatusofUser() {
	var data = localStorage.getItem("data")

	if(data === " ") {
		return "undefined";
	} else {
		var name = helper.getSplitValue(data, "=>", 0)
		var email = helper.getSplitValue(data, "=>", 2)
		var avatar = helper.getSplitValue(data, "=>", 1)
		avatNum = helper.getSplitValue(avatar, "/", -1)

		return avatNum;
	}
}

function removeLoggedInStatusofUser() {
	fs.writeFile("./scratch/data", " ", (err) => {
		if (err) throw err;
		console.log("User temporary data removed");
	});

}
