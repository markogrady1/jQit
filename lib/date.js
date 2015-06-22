

//will split format of 02-01-2015 or 02/01/2015
exports.dateFormatDash = function(dateString, endian, callback){
	newDate = '';
	var date = dateString.split('-');	
	dateEndian(date, endian, function(month){
		callback(month);
	});
}

exports.dateFormatSlash = function(dateString, endian, callback){
	newDate = '';
	var date = dateString.split('/');	
	dateEndian(date, endian, function(month){
		callback(month);
	});
}

function dateEndian(dateVal, endian, callback) {
	switch (endian) {
		case 'L':
			newDate = dateVal[0] + "-" + dateVal[1] + "-" + dateVal[2];
			break;
		case 'M':
			newDate = dateVal[1] + "-" + dateVal[0] + "-" + dateVal[2];
			break;
		case 'B':
			newDate = dateVal[2] + "-" + dateVal[1] + "-" + dateVal[0];
			break;
	}
	
	callback(newDate);
}

exports.timeFormat = function(isDifference) {

	return function(createAt, closedAt, callback){

		if(isDifference){
			var cr  = new Date(createAt);
			var cl = new Date(closedAt);
			var diff = (cl - cr)/1000;
			
			callback(diff)
		} else {
			diff = createAt;
			var dd = Math.floor(diff / 86400);
			var hh = Math.floor((diff % 86400) / 3600);
			var mm = Math.floor(((diff % 86400) % 3600) / 60);
			var ss = Math.floor((diff % 86400) % 3600) % 60;
			val = dd + " days " + hh + " hours " + mm + " minutes " + ss + " seconds";

			callback(val)
		}
	}
}


// var setTimes = function(op, cl){
// 	var op  = new Date(op);
// 	var cl = new Date(cl);
// 	var diff = (cl - op)/1000;

// 	return diff;
// };

// exports.dateTimes = function(createAt, closedAt, callback){
// 	if(closedAt != null){
// 		val = setTimes(createAt, closedAt);
// 		callback(val)
// 	}else{
// 		diff = createAt;
// 		var dd = Math.floor(diff / 86400);
// 		var hh = Math.floor((diff % 86400) / 3600);
// 		var mm = Math.floor(((diff % 86400) % 3600) / 60);
// 		var ss = Math.floor((diff % 86400) % 3600) % 60;

// 		val = dd + " days " + hh + " hours " + mm + " minutes " + ss + " seconds";
// 		callback(val)
// 	}
// }

