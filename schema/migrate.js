var tmpLog = require('../repoData/tmpLogger');
var MongoClient = require('mongodb').MongoClient;

var request = require('request');

exports.repositoryMigrate = function(){
	tmpLog.update('DATA MIGRATION', 'repositories loading...', false);

	MongoClient.connect("mongodb://127.0.0.1:27017/repositories", function(err, db){
	if(err) throw err;	
	db.collection('repos').remove({});
	var allRepos = require('../repoData/rep');	    	
    db.collection('repos').insert(allRepos, function(err, data){
    
    	if(err) throw err;
    	tmpLog.update('DATA MIGRATION', 'jquery repositories loaded', true);
		db.close();
    	});
	});
}

MongoClient.connect("mongodb://127.0.0.1:27017/issues", function(err, db){

	if(err) throw err;

	for(var i = 1; i < 48; i++){
		var obj = require('../repoData/' + i);
		if(obj == ""){
			continue
		}
        
        var url = obj.map(function(data) {return data.url; });
	    urlValue = url.toString();
	    
	    nameArr = urlValue.split('/');
	    		
	    dataName = nameArr[5];
	    
	    db.collection(dataName).remove({});
        
        db.collection(dataName).insert(obj, function(err, data){
            if(err) throw err;

        });
	}
	tmpLog.update('DATA MIGRATION', 'jquery issues loaded', true);
});


	