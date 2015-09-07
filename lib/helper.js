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
exports.getSplitValue = function(origVal, index, separator) {
	var fullStr = origVal.toString();
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
 * Return a totally random string for varification and other causes
 * @return {Number} c
 */
exports.getRandomString = function() {
	for(var c = ''; c.length < 32;) c += Math.random().toString(36).substr(2, 1)
	return c;
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
