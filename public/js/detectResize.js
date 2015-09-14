'use strict'
/**
 * ==================================
 * Author: Mark O Grady (c) 2015
 * ==================================
 */


/**
 * Global variables for different window sizes
 *
 */
var chartWidth, barChartHeight, lineChartHeight, standard, scope, $text;

/**
 * Used to detect the change of browser window width
 *
 */
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

/**
 * Repaint all of the charts when browser window has a change of size
 *
 */
var repaint = function() {
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

var issuesLineData = setChartObject(chartWidth, lineChartHeight, 48, 72, 60, 40, 20, "#chartArea", scope, true, "date", "issues", 20);

var pullsLineData = setChartObject(chartWidth, lineChartHeight, 48, 72, 60, 40, 10, "#chartArea2", scope, false, "date", "pulls", 9);

var issuesBarData = setChartObject(chartWidth, barChartHeight, 48, 72, 60, 40, 0, "#chartArea", scope, true, "date", "issues")

var pullsBarData = setChartObject(chartWidth, barChartHeight, 48, 72, 60, 40, 0, "#chartArea2", scope, false, "date", "pulls");

function setChartObject(w, h, top, bottom, left, right, padding, chArea, scope, isIssue, key, val, titleY) {

	if(typeof titleY === "undefined") titleY = null;

	var obj = {
		w: w, 
	    h: h,
	    top: top,
	    bottom: bottom,
	    left: left,
	    right: right,
	    padding: padding,
	    chartArea: chArea,
	    scope: scope,
	    isIssue: isIssue,
	    dataKey: key,
	    dataVal: val,
	    title: {
	    	y: titleY
	    }
	}
	return obj;
}




	var dataset = [] ;
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