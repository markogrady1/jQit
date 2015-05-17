var hist = require('./recentIssues');
hist.migrateHistory();
var migrate = require('./schema/migrate');
migrate.repositoryMigrate();

var express = require('express')
    , app = express()
    , routes = require('./routes/route')
    , path = require('path')
    , schema = require('./schema/schema');

app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next){
	res.set('X-Powered-By', 'Issue-Tracker');
	next();
});

var server = app.listen('3001', function(){
	host = server.address().address;
	port = server.address().port;
  	console.log('Listening on port: %s', port);
});


app.use('/', routes);
module.exports = app;