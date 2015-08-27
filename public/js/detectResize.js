
var detectWindowSize = function() {

	var clientWidth = document.body.clientWidth;
	if(clientWidth <= 461 && v.length > 5) {
		console.log('mobile');
		v = temp;
		v = v.slice(-8);
		pr = pr.slice(-8);
		chartWidth = 400;
		barChartHeight = 300;
		lineChartHeight = 300;
		standard = false;
		scope = 'last 8 Days';

	} else if (clientWidth > 461 && clientWidth <= 657) {
		v = temp;
		v = v.slice(-10);
		pr = pr.slice(-10);
		chartWidth = 500;
		barChartHeight = 400;
		lineChartHeight = 300;
		standard = false;
		scope = 'Last 10 Days';
	} else if (clientWidth > 657 && clientWidth <= 860) {
		console.log('tablet');
		v = temp;
		v = v.slice(-12);
		pr = pr.slice(-12);
		$text = $('text > .line-x-axis-title');
		$text.text('last 15 days');
		$text.css('color', 'red');
		chartWidth = 700;
		barChartHeight = 450;
		lineChartHeight = 300;
		standard = false;
		scope = 'Last 12 Days';
	} else if (clientWidth > 860 && clientWidth < 1064) {
		console.log('tablet');
		v = temp;
		v = v.slice(-15);
		pr = pr.slice(-15);
		$text = $('text > .line-x-axis-title');
		$text.text('last 15 days');
		$text.css('color', 'red');
		chartWidth = 900;
		barChartHeight = 500;
		lineChartHeight = 300;
		standard = false;
		scope = 'Last 15 Days';
	} else if(clientWidth > 1064){
		standard = true;
		chartWidth = 1100;
		barChartHeight = 550;
		lineChartHeight = 350;
		scope = 'Last 30 Days';
	}

};


var repaint = function() {
	// console.log(document.body.clientWidth);
	// var temp = v;
	// var temp2 = pr;
	var standard = true;
	var clientWidth = document.body.clientWidth;
	if(clientWidth <= 461 && v.length > 5) {
		console.log('mobile');
		v = temp;
		v = v.slice(-8);
		pr = pr.slice(-8);
		chartWidth = 400;
		barChartHeight = 300;
		lineChartHeight = 300;
	standard = false;


	} else if (clientWidth > 461 && clientWidth <= 657) {
		v = temp;
		v = v.slice(-10);
		pr = pr.slice(-10);
		chartWidth = 500;
		barChartHeight = 400;
		lineChartHeight = 300;
		standard = false;
	} else if (clientWidth > 657 && clientWidth <= 860) {
		console.log('tablet');
		v = temp;
		v = v.slice(-12);
		pr = pr.slice(-12);
		$text = $('text > .line-x-axis-title');
		$text.text('last 15 days');
		$text.css('color', 'red');
		chartWidth = 700;
		barChartHeight = 450;
		lineChartHeight = 300;
		standard = false;
	} else if (clientWidth > 860 && clientWidth < 1064) {
		console.log('tablet');
		v = temp;
		v = v.slice(-15);
		pr = pr.slice(-15);
		$text = $('text > .line-x-axis-title');
		$text.text('last 15 days');
		$text.css('color', 'red');
		chartWidth = 900;
		barChartHeight = 500;
		lineChartHeight = 300;
		standard = false;
	} else if(clientWidth > 1064){
		standard = true;
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
};

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
};

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
	var m = [];
	if(standard) {
		for(var i in temp) {
		   n.push({'date': temp[i].date, 'issues': temp[i].issues});
		    // dataset.push(v[k].issues);
		}
		for(var j in temp2) {
		  m.push({'date': temp2[j].date, 'pulls': temp2[j].pulls});
		    //dataset.push(pr[y].pulls);
		}
	} else {


		for(var k in v) {
		   n.push({'date': v[k].date, 'issues': v[k].issues});
		    // dataset.push(v[k].issues);
		}

		for(var y in pr) {
		  m.push({'date': pr[y].date, 'pulls': pr[y].pulls});
		    //dataset.push(pr[y].pulls);
		}
}
setBarChart(n, issuesBarData);
setLineChart(n, issuesLineData);
setBarChart(m, pullsBarData);
setLineChart(m, pullsLineData);
};

window.addEventListener("resize", repaint);

//the onload function is not needed so much right now
// window.onload = function() {
//  detectWindowSize();
// };