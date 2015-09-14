/**
 * This script helps with random tasks throughout the application
 * ==============================================================
 */


/**
 * Spit any string values with a seperator
 * 
 * @param {String} origVal
 * @param {Number} index
 * @param {String} separator
 * @return {*} [item]
 */
exports.getSplitValue = function(origVal, separator, index) {
	var fullStr = origVal.toString();
	if(typeof index === 'undefined')
		return fullStr.split(separator);
	
    var arr = fullStr.split(separator);
    index = index === -1 ? arr.length-1 : index;
    var item = arr[index];  
    return item;
}

/**
 * Log data into console
 * 
 * @param {String} concern
 * @param {String} info
 * @param {String} sep
 */
exports.log = function(concern, info, sep) {
	sep = !sep ? '': '\n------------------------'
	console.log(concern + ": - " + info + " -" + sep);
}

/**
 * Write string to file in JSON format
 * 
 * @param {String} file
 * @param {String} key
 * @param {Boolean} isUser
 */
exports.writeStorage = function(file, key, isUser) {
	var fs = require('fs');
	var data = "[{\""+key+"\":"+ isUser+"}]";
	fs.writeFile(file, data, function(err) {
	    if(err) {
	        return console.log(err);
	    }
    	console.log("The file was saved!");
	}); 
}

/**
 * Return a random string for tokens of a given size
 * 
 * @param {Number} length
 * @return {String} result
 */
exports.randomString = function(strLength) {
	strLength = strLength || 12;
	var characters = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";
	var result = "";
	for (var i = 0; i < strLength; i++) {
		var num = Math.floor(Math.random() * characters.length);
		result += characters.substring(num, num + 1);
	}
	return result;
}

/**
 * Return a totally random string for verification and other causes
 * @return {Number} c
 */
exports.getRandomString = function() {
	for(var c = ''; c.length < 32;) c += Math.random().toString(36).substr(2, 1)
	return c;
}