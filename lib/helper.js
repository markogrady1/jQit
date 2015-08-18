

exports.getSplitValue = function(origVal, index, separator) {
	var fullStr = origVal.toString();
    var arr = fullStr.split(separator);
    var item = arr[index];  
    return item;
}

exports.log = function(concern, info, sep) {
	sep = !sep ? '': '\n------------------------'
	console.log(concern + ": - " + info + " -" + sep);
}

exports.randomizeString = function() {
	var rndStr;
	for(var c = ''; c.length < 32;) 
		rndStr += Math.random().toString(36).substr(2, 1)
	return rndStr;
}


