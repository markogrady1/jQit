var dateFormatter = module.exports = {};

/**
 * Split date into a given format
 * will split format of 02-01-2015
 *
 * @param {String} dateString
 * @param {String} endian
 * @param {Function} callback
 */
dateFormatter.dateFormatDash = function(dateString, endian, callback){
	newDate = '';
	var date = dateString.split('-');	
	this.dateEndian(date, endian, (month) => {
		callback(month);
	});
}

/**
 * Split date into a given format
 * will split format of 02/01/2015
 *
 * @param {String} dateString
 * @param {String} endian
 * @param {Function} callback
 */
dateFormatter.dateFormatSlash = function(dateString, endian, callback){
	newDate = '';
	var date = dateString.split('/');	
	this.dateEndian(date, endian, (month) => {
		callback(month);
	});
}

/**
 * Assign format of date to a given endian
 *
 * @param {String} dateVal
 * @param {String} endian
 * @param {Function} callback
 */

dateFormatter.dateEndian= function(dateVal, endian, callback) {
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

/**
 * Give partial function to format the milliseconds of the date
 *
 * @param {Boolean} isDifference
 * @return {Function} Function
 */
dateFormatter.timeFormat = function(isDifference) {

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
