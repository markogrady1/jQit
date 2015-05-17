
var MongoClient = require('mongodb').MongoClient;
// var http = require('http');
// http.request({headers: {connection: 'keep-alive'}, agent: false});
// 	process.on('uncaughtException', function (err) {
//   // console.log('ERROR-OCCURED: ' + err )
// });

exports.setHistory = function(date, collection, issueAmount){

		// console.log('repositories loading...');
	MongoClient.connect("mongodb://127.0.0.1:27017/repoHistory", function(err, db){
		if(err) throw err;	
	   		   // db.collection(collection).remove({});
	   				
	   	var doc = {'date': date, 'issues': issueAmount};

	   	db.collection(collection).insert(doc, function(err, inserted){
	   		if(err) throw err;
	   		
	   		db.close(); 
	   	});
	});
}


exports.resetHistory = function(){

	MongoClient.connect("mongodb://127.0.0.1:27017/repoHistory", function(err, db){
	if(err) throw err;	
	db.dropDatabase();
		db.close();
    	});
	console.log('HISTORY: - prev hist removed -')
}