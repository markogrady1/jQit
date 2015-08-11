
var detectWindowSize = function() {
	console.log(document.body.clientWidth);

	var clientWidth = document.body.clientWidth;
	if(clientWidth <= 400 && v.length > 5) {
		console.log('mobile')
		v = v.slice(-8)
		chartWidth = 400;
		barChartHeight = 300;
		lineChartHeight = 300;
		scope = "Last 8 Days";
	} else if (clientWidth > 400 && clientWidth < 1000) {
		console.log('tablet')
		v = v.slice(-15)
		chartWidth = 700;
		barChartHeight = 450;
		lineChartHeight = 320;
		scope = "Last 15 Days";
	} else {
		scope = "Last 30 Days";
		chartWidth = 1100;
		barChartHeight = 550;
		lineChartHeight = 350;
	}

}


var repaint = function() {
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
		v = v.slice(-15)
		$text = $('text > .line-x-axis-title');
		$text.text('last 15 days');
		$text.css('color', 'red');
		// var text = document.getElementsByClassName('x-axis-title');
		// console.log(text[0])
		// text[0].innerHTML = 'Last 15 Days';
	} else if(clientWidth > 1000){
		chartWidth = 1100;
		barChartHeight = 550;
		lineChartHeight = 350;
	}






issuesLineData = {
    w: chartWidth,
    h: lineChartHeight,
    top: 48,
    bottom: 72,
    left: 60,
    right: 40,
    padding: 20,
    chartArea: "#chartArea",
    scope: scope,
    isIssue: true,
    dataKey: "date",
    dataVal: "issues",
    title : {
      y: 20
  }
}

pullsLineData = {
    w: chartWidth,
    h: lineChartHeight,
    top: 48,
    bottom: 72,
    left: 60,
    right: 40,
    padding: 10,
    chartArea: "#chartArea2",
    scope: scope,
    isIssue: false,
    dataKey: "date",
    dataVal: "pulls",
    title : {
      y: 9
  }
}
issuesBarData = {
    w: chartWidth, 
    h: barChartHeight,
    top: 48,
    bottom: 72,
    left: 60,
    right: 40,
    padding: 0,
    chartArea: "#chartArea",
    scope: scope,
    isIssue: true,
    dataKey: "date",
    dataVal: "issues"
  };


 pullsBarData = {
    w: chartWidth, 
    h: barChartHeight,
    top: 48,
    bottom: 72,
    left: 60,
    right: 40,
    padding: 0,
    chartArea: "#chartArea2",
    scope: scope,
    isIssue: false,
    dataKey: "date",
    dataVal: "pulls"
  };
	dataset = [] ;
	var n = [];
for(var k in v) {
   n.push({'date': v[k].date, 'issues': v[k].issues});
    // dataset.push(v[k].issues);
}
	setBarChart(n, issuesBarData)
setLineChart(n, issuesLineData)
// setBarChart(pullsArr, pullsBarData)
// setLineChart(pullsArr, pullsLineData)
}

window.addEventListener("resize", repaint);

//the onload function is not needed so much right now
// window.onload = function() {
//  detectWindowSize();
// };