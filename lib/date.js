
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
