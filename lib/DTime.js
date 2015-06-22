module.exports = DTime;


function DTime(create, close){
	this.createdAt = create;
	this.closedAt = close;
	this.diff = (close !== null) ? this.difference(create, close) : '';
	this.timeString = (this.diff !== '') ? this.actualTimeStamp(this.diff) : '';

}


DTime.prototype.difference = function(create, close){
	var op  = new Date(create);
	var cl = new Date(close);
	var diff = (close - create)/1000;

	return diff;
}

DTime.prototype.actualTimeStamp = function(timeStamp){
	diff = timeStamp;
	var dd = Math.floor(diff / 86400);
	var hh = Math.floor((diff % 86400) / 3600);
	var mm = Math.floor(((diff % 86400) % 3600) / 60);
	var ss = Math.floor((diff % 86400) % 3600) % 60;
	timeValue = dd + " days " + hh + " hours " + mm + " minutes " + ss + " seconds";

	return timeValue;
}

DTime.prototype.getTimeStamp = function(isDifference, cb){
	if(isDifference){
		cb(this.diff);
	}else{
		cb(this.timeString);
	}
	
}