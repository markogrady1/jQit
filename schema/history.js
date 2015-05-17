var MongoClient = require('mongodb').MongoClient;

exports.setHistory = function(date, collection, issueAmount){

	MongoClient.connect("mongodb://127.0.0.1:27017/repoHistory", function(err, db){
		if(err) throw err;	
	   				
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