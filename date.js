
//will split format of 02-12-15
exports.dateArray = function(dateString){
	
	var date = date.split('-');

	return date;
}

exports.monthString = function(dateVal, callback) {
m = '';
month = dateVal;
	isMonth(month, function(month){
		m = month;
	});
	callback(m);
}

function isMonth(val, callback) {
	if (val == '01') {
		callback('Jan');
	}
}