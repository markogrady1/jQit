
var detectWindowSize = function() {
	console.log(document.body.clientWidth);

	var clientWidth = document.body.clientWidth;
	if(clientWidth <= 400 && v.length > 5) {
		console.log('mobile')
		v = v.slice(-8)
		chartWidth = 400;
		barChartHeight = 300;
		lineChartHeight = 300;
	} else if (clientWidth > 400 && clientWidth < 1000) {
		console.log('tablet')
	} else {
		chartWidth = 1100;
		barChartHeight = 550;
		lineChartHeight = 350;
	}
}

window.addEventListener("resize", detectWindowSize);

//the onload function is not needed so much right now
// window.onload = function() {
//  detectWindowSize();
// };