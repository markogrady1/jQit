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
exports.log = function(concern, info, sep, colors) {
	sep = !sep ? '': '\n------------------------';
	if(typeof colors !== 'undefined') {
		console.log(colors[0]+'\x1b[36m%s\x1b[0m',concern + ": - " + info + " -" ,sep);
	}
	else {
		console.log('%s\x1b[31m%s\x1b[0m',concern + ": - " + info + " -" , sep);
	}
}



exports.print = function(colors) {
	console.log(colors, arguments[1], arguments[2]);
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
	fs.writeFile(file, data, (err) => {
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

exports.terminalCol = function(colorStr) {
	var colArr = [];
	if(typeof colorStr === 'undefined') {
		colArr['cyan'] = '\x1b[36m%s\x1b[0m';
		colArr['yellow'] = '\x1b[33m%s\x1b[0m';
		colArr['black'] = '\x1b[30m%s\x1b[0m';
		colArr['green'] = '\x1b[32m%s\x1b[0m';
		colArr['magenta'] = '\x1b[35m%s\x1b[0m';
		colArr['red'] = '\x1b[31m%s\x1b[0m';	
		colArr['blue'] = '\x1b[34m%s\x1b[0m';
		return colArr;
	} else {
		colArr['white'] = '\x1b[00m\x1b';	
		colArr['cyan'] = '\x1b[35m\x1b';	
		colArr['yellow'] = '\x1b[33m\x1b';
		colArr['black'] = '\x1b[30m\x1b';
		colArr['green'] = '\x1b[32m\x1b';
		colArr['magenta'] = '\x1b[35m\x1b';
		colArr['red'] = '\x1b[31m\x1b';	
		colArr['blue'] = '\x1b[34m\x1b';
		return colArr;
	}
}

exports.terminalStyle = function() {
	var styleArr = [];
	styleArr['reset'] = '\x1b[0m';
	styleArr['bright'] = '\x1b[1m';
	styleArr['dim'] = '\x1b[2m';
	styleArr['blink'] = '\x1b[3m';
	styleArr['reverse'] = '\x1b[4m';
	styleArr['hidden'] = '\x1b[5m';
	styleArr['warn'] = '\x1b[35m';
	styleArr['error'] = '\x1b[31m';
	styleArr['log'] = '\x1b[5m';
	return styleArr;
}
