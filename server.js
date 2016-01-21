var hst = require("./schema/history")
    , migrate = require("./schema/repoMigrate")
    , express = require("express")
    , app = express()
    , routes = require("./routes/route")
    , resolve = require("./lib/mainController")
    , path = require("path")
    , schema = require("./schema/schema")
    , bodyParser = require("body-parser")
    , cookieParser = require("cookie-parser")
    , session = require("express-session")
    , color = require("./lib/helper").terminalCol();

schema.initConnection();
app.engine(".html", require("ejs").__express);
app.set("views", __dirname + "/views/");
app.set("view engine", "html");

    app.locals.repoComparison = require("./schema/schema");

// app.locals.visualHelper = require("./lib/dataProvider");
//app.locals.getEvents = require("./lib/resolve")
app.use(cookieParser());
app.use(session({
	secret:"jkgabglhantiovqatapiteioatbthtipw4uiwtwu4hthtui42htuohRUVH3932HRTEJGWTWVEHGUIHAIHJSoheojahghvghjkher9turhtreig",
	saveUninitialized: true,
	resave: true 
}));


app.use(express.static(path.join(__dirname, "public")));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next){
	res.set("X-Powered-By", "Issue-Tracker");
	next();
});

var server = app.listen("3000", () => {
	host = server.address().address;
	port = server.address().port;
  	console.log(color["cyan"]+color["yellow"],"Listening on port: ", port);
});
var io_ = require("socket.io");
var io = io_.listen(server);

io.on("disconnect", function(socket){
	localStorage.setItem("data", "");
});
resolve.checkForAssigneeAddition();
app.use("/", routes(app, server, io));
module.exports = app;
