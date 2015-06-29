var hst = require('./schema/history')
    , migrate = require('./schema/migrate')
    , express = require('express')
    , app = express()
    , routes = require('./routes/route')
    , path = require('path')
    , schema = require('./schema/schema')
    , bodyParser = require('body-parser')
    , cookieParser = require('cookie-parser')
    , session = require('express-session')
migrates();

schema.initConnection();
app.engine('.html', require('ejs').__express);
app.set('views', __dirname + "/views/");
app.set('view engine', 'html');

app.locals.visualHelper = require('./lib/dataProvider');
//routes.instance(app);
//app.locals.username = '';
app.locals.getEvents = require('./lib/resolve')
app.use(cookieParser());
app.use(session({ secret:'mynameisthemanofthemoon', saveUninitialized: true, resave: true })); 
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(function(req, res, next){
	res.set('X-Powered-By', 'Issue-Tracker');
	next();
});

var server = app.listen('3000', function(){
	host = server.address().address;
	port = server.address().port;
  	console.log('Listening on port: %s', port);
});

// pass server to schema
schema.soc(server)
    
function migrates() {
	migrate.repositoryMigrate();
	migrate.pullsMigrate();
	migrate.closedDataMigration('pulls');
	migrate.closedDataMigration('issues');
	migrate.eventsMigrate();
}

app.use('/', routes(app, server));
module.exports = app;

