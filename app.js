var hst = require('./recentIssues');
hst.migrateHistory();
var migrate = require('./schema/migrate');
migrates();

function migrates() {
	migrate.repositoryMigrate();
	migrate.pullsMigrate();
	// migrate.pullsClosedMigrate();
	// migrate.issuesClosedMigrate();
	migrate.closedDataMigration('pulls');
	migrate.closedDataMigration('issues');
}
var express = require('express'), 
	app = express(), 
	routes = require('./routes/route'), 
	path = require('path'), 
	schema = require('./schema/schema');

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + "/views/");
app.set('view engine', 'html');
app.locals.chartTester = require('./lib/chartTest');
app.locals.visualHelper = require('./lib/dataProvider');


app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
	res.set('X-Powered-By', 'Issue-Tracker');
	next();
});

var server = app.listen('3000', function(){
	host = server.address().address;
	port = server.address().port;
  	console.log('Listening on port: %s', port);
});


app.use('/', routes);
module.exports = app;