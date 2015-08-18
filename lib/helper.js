
//spit any string values with a seperator
exports.getSplitValue = function(origVal, index, separator) {
	var fullStr = origVal.toString();
    var arr = fullStr.split(separator);
    var item = arr[index];  
    return item;
}

//log data into console
exports.log = function(concern, info, sep) {
	sep = !sep ? '': '\n------------------------'
	console.log(concern + ": - " + info + " -" + sep);
}

//return a totally random string for varification and other causes
exports.getRandomString = function() {
	for(var c = ''; c.length < 32;) c += Math.random().toString(36).substr(2, 1)
	return c;
}


