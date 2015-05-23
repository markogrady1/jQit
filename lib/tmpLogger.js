exports.update = function(concern, info, sep) {
	sep = !sep ? '': '\n------------------------'
	console.log(concern + ": - " + info + " -" + sep);
}