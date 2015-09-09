'use strict';


function setCharts() {
	detectWindowSize();
         var admin = [];
         for(var l in p) {
          admin.push({'user': l, 'closed': p[l]});
         }
         var jSonArr = JSON.stringify(admin);
         var dataset = [] ;
         for(var k in v) {
             issuesArr.push({'date': v[k].date, 'issues': v[k].issues});
             dataset.push(v[k].issues);
         }
         
         for(var y in pr) {
           pullsArr.push({'date': pr[y].date, 'pulls': pr[y].pulls});
         }
         
         var jArr = JSON.stringify(issuesArr);
         var issuesLineData = {
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
         
         var pullsLineData = {
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

         var issuesBarData = {
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
         
         
         var pullsBarData = {
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

         var  historyObj = {
           allRepoIssueHistory: allIssuesHistory,
           allRepoPullsHistory: allPullsHistory,
           allRepoName: repoData
         };
         setBarChart(issuesArr, issuesBarData, historyObj);
         setLineChart(issuesArr, issuesLineData);
         setBarChart(pullsArr, pullsBarData);
         setLineChart(pullsArr, pullsLineData);
         
         
         if(issuesArr.length == 0){
           var el = document.getElementById('chartArea');
             el.innerHTML = 'There have been no issues in the last 30 days';
             el.setAttribute('class', 'status');
         }
}





var totaller;
var $viewEle;
var hideLineChart = function() {
	var $lineChart = $('#line-chart');
	$lineChart.css('display', 'none');
};

function setBarChart(data, buildStyle, histObj) {
var toolTipValue = buildStyle.isIssue ? "Open Issues" : "Pull Requests";
	var tot = 0;
	var isIss =false;
	if(buildStyle.dataVal === 'issues')
		isIss = true;
	var chartId = buildStyle.isIssue ? "" : "pulls-";
	$viewEle = buildStyle.isIssue ? $('#changeView2') : $('#changeView');
	$viewEle.find('btn').remove();
	tot = _.reduce(data, function(sum, d){ return sum + d[buildStyle.dataVal]; }, 0 );
	var issuetmp = [];
	var pulltmp = [];

	_.map(data, function(d){
		if(buildStyle.dataVal === 'issues')
			issuetmp.push(d[buildStyle.dataVal]);
		else 
			pulltmp.push(d[buildStyle.dataVal]);
	});

	if (buildStyle.isIssue) totaller = tot;

	if (!buildStyle.isIssue){
		if (tot !== 0 && totaller !== 0) {
			assignPullButtons();
		}
	}

	if (tot !== 0) {
		if(buildStyle.isIssue) {
			setIssueCompareSelection(histObj);
			setPullsCompareSelection(histObj);
			setUpMultipleCompareBtn(histObj);
			var $bt2 = $('.line-btn');
			$bt2.remove();
		var lineBtn = document.createElement('button');
		$(lineBtn).text('View Line Chart');
		$viewEle.append(lineBtn);
		$(lineBtn).attr({
			width: 200,
			class: 'line-btn'	
		});

		$viewEle.append(lineBtn);
		assignLineListener(lineBtn);
	}

	var width = buildStyle.w - buildStyle.left - buildStyle.right;
	var height = buildStyle.h - buildStyle.top - buildStyle.bottom;
	var tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([-10, 0])
		  .html(function(d, i) {
		  	var date;
		  	if(buildStyle.dataVal !== 'issues') { dt = pdt; }
		  	nth(d[buildStyle.dataKey], function(val){
		  		date = val;
		  	});
		  	var s = dt[i].split('T');
		  	var dateBits = s[0].split('-');
			var da = s[0].substring(s[0].length, 8).trim();
			var monthStr = getMonthString(dateBits[1]);
		 	var progressStr;
		 	var prog, check;
			if(isIss) check = issuetmp[i-1];
			else check = pulltmp[i-1];
			if (typeof check !== 'undefined') {
				if(isIss)
					prog = d[buildStyle.dataVal] - issuetmp[i-1];
				else
					prog = d[buildStyle.dataVal] - pulltmp[i-1];
				if(prog < 0) {
					prog = prog.toString().replace('-','');
					progressStr = '<span class=decrease>▼ </span>' + prog + ' since the previous day';
				} else if (prog === 0) {
					progressStr = '<span class=same>▶ </span>No change';
				} else {
					progressStr = '<span class=increase>▲ </span>'  + prog + ' since the previous day';
				}
			} else {
				progressStr = '';
			}
				    return "<span class=line-tip>Date: " + date + " " + monthStr + " " + dateBits[0] + "</span><br><br> <span class=line-tip>" + toolTipValue + ": " + d[buildStyle.dataVal] + "</span><br><br>" + progressStr;
		 });
	var x = d3.scale.ordinal()
		.domain(data.map(function(entry){
			return entry[buildStyle.dataKey];
		}))
		.rangeBands([0, width]);
	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d){
			return d[buildStyle.dataVal];	
		})])
		.range([height, 0]);
	var yGridlines = d3.svg.axis()
				.scale(y)
				.tickSize(-width, 0, 0)
				.tickFormat('')
				.orient('left');
	var linearColorScale = d3.scale.linear()
				.domain([0, data.length])
				.range(['#4A84B0', '#c6dbef']);
	var ordinalColorScale = d3.scale.category20();
	var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom');
	var frm = d3.format("0d");
	var yAxis = d3.svg.axis()
			.scale(y)
			.tickFormat(frm)
			.orient('left');

	var $e = $(buildStyle.chartArea).find('svg');
	$e.remove();
	var svg = d3.select(buildStyle.chartArea).append('svg')
			.attr('id', chartId + 'chart')
			.attr('height', buildStyle.h)
			.attr('width', buildStyle.w);
	svg.call(tip);
	var chart = svg.append('g')
			.classed('display', true)
			.attr('transform', 'translate(' + buildStyle.left + ',' + buildStyle.right + ')');
	chart.append("text")
			.classed(buildStyle.dataVal+ '-title', true)
	        .attr("x", (width / 2))             
	        .attr("y", 0 - (buildStyle.top / 2))
	        .attr("text-anchor", "middle")  
	        .text(toolTipValue.toUpperCase());

	plot.call(chart, {
		data:data,
		axis: {
		    x: xAxis,
		    y: yAxis,
		}, 
		gridlines: yGridlines,
		isIssue: buildStyle.isIssue
	});
	} 

function plot(params) {
	var e;
	var classAppend = params.isIssue ? '' : 's';
	this.append('g')
		.call(params.gridlines)
		.classed('gridline', true)
		.attr('transform', 'translate(0,0)');
	this.selectAll('.bar' + classAppend)
		.data(params.data)
		.enter()
		  .append('rect')
		  .classed('bar'+ classAppend, true)
		  .attr('x', function(d, i){
			return x(d[buildStyle.dataKey]);
		  })
		  .attr('value', function(d, i) {
			return d[buildStyle.dataKey]  + ' ' + d[buildStyle.dataVal];
		  })
		  .attr('y', function(d, i){
			return y(d[buildStyle.dataVal]);
		  })
		  .attr('width', function(d, i){
			return x.rangeBand()-2;
		  })
		  .attr('height', function(d, i){
			return height - y(d[buildStyle.dataVal]);
		  })
		  .on('click', tip.show)
      	  .on('mouseout', tip.hide)
		  .on('mouseover', function(d, i){
		  	e = $(this).css('fill');
			$(this).css('fill', '#3C7BD5');
			var el = d3.select(this);
			el.transition()
				.duration(300)
				.attr({
				width: x.rangeBand()+5,
				height:height - y(d[buildStyle.dataVal])+3,
				y: y(d[buildStyle.dataVal])-3
			});						
		 this.parentNode.appendChild(this); 
		  })
		  .on('mouseleave', function(d, i){
		  	$('.display-data').remove();
			$(this).css('fill', e);
			var el = d3.select(this);
			el.transition()
				.duration(500)
				.attr({
				height: height - y(d[buildStyle.dataVal]),
				y: y(d[buildStyle.dataVal]),
				width:x.rangeBand()-2
			});						
		  })
		  .style('fill', function(d, i){
			//return ordinalColorScale(i);//uncomment line for ordinalScale colours
			return linearColorScale(i);  //uncomment line for linearScale colours
		  })
		  .style('cursor', 'pointer');

	this.selectAll('.bar-label')
		.data(params.data)
		.enter()
		  .append('text')
		  .classed('bar-label', true)
		  .attr('x', function(d, i){
			return x(d[buildStyle.dataKey]) + (x.rangeBand()/2);
		  })
		   .attr('y', function(d, i){
			return y(d[buildStyle.dataVal]);
		  })
		  .attr('dx', 0)
		  .attr('dy', -6)
		  .text(function(d, i){
			return d[buildStyle.dataVal];
		  });
	this.append('g')
	    .classed('x axis', true)
	    .attr('transform', 'translate(' + 0 + ',' + height + ')')
	    .call(params.axis.x)
		.selectAll('text')
		    .style('text-anchor', 'end')
		    .attr('dx', -8)
		    .attr('dy', 8)
		    .attr('transform', 'translate(0,0) rotate(-45)');
	this.append('g')
	    .classed('y axis', true)
	    .attr('transform', 'translate(0,0)')
	    .call(params.axis.y);
	this.select('.y.axis')
		.append('text')
		.attr('x', 0)
		.attr('y', 0)
		.style('text-anchor', 'middle')
		.attr('transform', 'translate(-50, ' + height / 2 +') rotate(-90)')
		.text('No. of '+ buildStyle.dataVal.charAt(0).toUpperCase() + buildStyle.dataVal.slice(1));
	this.select('.x.axis')
		.append('text')
		.attr('x', 0)
		.attr('y', 0)
		.classed('x-axis-title', true)
		.style('text-anchor', 'middle')
		.attr('transform', 'translate(' + width / 2 + ', 50)')
		.text(buildStyle.scope);
		
	}	

	if (buildStyle.isIssue)
		$('#chartArea2').hide();
}

function setLineChart(data, buildStyle) {
	var toolTipValue = buildStyle.isIssue ? "Open Issues" : "Pull Requests";
	var chartId = buildStyle.isIssue ? "" : "pulls-";
	var tot = 0;
	for (var i = 0; i < data.length; i++) {
		tot += data[i][buildStyle.dataVal];
	}

	if (tot !== 0) {
		
		var tip = d3.tip()
				  .attr('class', 'd3-tip')
				  .offset([-10, 0])
				  .html(function(d, i) {
				  	var date;
				  	if(buildStyle.dataVal !== 'issues') { dt = pdt; }
				  	nth(d[buildStyle.dataKey], function(val) {
				  		date = val;
				  	});
				  	var s = dt[i].split('T');
				  	var dateBits = s[0].split('-');
	    			var da = s[0].substring(s[0].length, 8).trim();
					var monthStr = getMonthString(dateBits[1]);
					
				    return "<span class=line-tip>Date: " + date + " " + monthStr + " " + dateBits[0] + "</span><br><br> <span class=line-tip>" + toolTipValue + ": " + d[buildStyle.dataVal] + "</span>";
				  });
		var width = buildStyle.w - buildStyle.left - buildStyle.right;
		var height = buildStyle.h - buildStyle.top - buildStyle.bottom;
		// $e = $(buildStyle.chartArea).find('svg')
		// $e.remove();
		var svg = d3.select(buildStyle.chartArea).append('svg')
					.attr('id', chartId + 'line-chart')
					.attr('height', buildStyle.h + buildStyle.padding)
					.attr('width', buildStyle.w + buildStyle.padding)
					.style('padding-top', 30);
		svg.call(tip);
		var chart = svg.append('g')
					.classed('display', true)
					.attr('transform', 'translate('+ buildStyle.left+','+buildStyle.right+')');
		chart.append("text")
				.classed(buildStyle.dataVal + '-title', true)
		        .attr("x", (width / 2))             
		        .attr("y", 0 - (buildStyle.top / 2) - 20)
		        .attr("text-anchor", "middle")  
		        .text(toolTipValue.toUpperCase());
		var y = d3.scale.linear()
				.domain([0,d3.max(data, function(d) {
					return d[buildStyle.dataVal];
				})])
				.range([height, 0]);
		var x = d3.scale.ordinal()
				.domain(data.map(function(entry) {
				return entry[buildStyle.dataKey];
				}))
				.rangeBands([buildStyle.padding, width - buildStyle.padding]);

		var xAxis = d3.svg.axis()
				.scale(x)
				.orient('bottom');
		var frm = d3.format("0d");
		var yAxis = d3.svg.axis()
				.scale(y)
				.tickFormat(frm)
				.orient('left');
		var line = d3.svg.line()
					.x(function(d){
						return x(d[buildStyle.dataKey]);
					})
					.y(function(d){
						return y(d[buildStyle.dataVal]);
					})
					.interpolate('cardinal');
		var yGridlines = d3.svg.axis()
					.scale(y)
					.tickSize(-width, 0, 0)
					.tickFormat('')
					.orient('left');
		var plot = function(params) {
			this.append('g')
			.call(params.gridlines)
			.classed('gridline', true)
			.attr('transform', 'translate(0,0)');
			this.append('g')
		    .classed('x axis', true)
		    .attr('transform', 'translate(' + (-16 )+ ',' + (height +10)+ ')') //added -16 here to move x-axis left slightly
		    .call(params.axis.x)
			.selectAll('text')
			    .style('text-anchor', 'end')
			    .attr('dx', -8)
			    .attr('dy', 8)
			    .attr('transform', 'translate(0,0) rotate(-45)');
		this.append('g')
		    .classed('y axis', true)
		    .attr('transform', 'translate(-10,0)')//added -10 here to move y-axis left slightly
		    .call(params.axis.y);
		this.select('.y.axis')
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.style('text-anchor', 'middle')
			.attr('transform', 'translate(-40, ' + height / 2 +') rotate(-90)')
			.text('No. of '+ buildStyle.dataVal.charAt(0).toUpperCase() + buildStyle.dataVal.slice(1));
		this.select('.x.axis')
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.classed('line-x-axis-title', true)
			.style('text-anchor', 'middle')
			.attr('transform', 'translate(' + width / 2 + ', 50)')
			.text(buildStyle.scope);
			//enter
			this.selectAll('.trendline')
				.data([params.data])
				.enter()
				.append('path')
				.classed('trendline', true);
			this.selectAll('.point')
				.data(params.data)
				.enter()
				.append('circle')
				.classed('point', true)
				.attr('r', 3)
				.attr('value', function(d){
					return d[buildStyle.dataKey] + "  " + d[buildStyle.dataVal];
				})
				.on('mouseover', tip.show)
      				.on('mouseout', tip.hide);
			//update
			this.selectAll('.trendline')
				.attr('d', function(d){
					return line(d);
				});
			this.selectAll('.point')
				.attr('cx', function(d, i) {
					return x(d[buildStyle.dataKey]);
				})
				.attr('cy', function(d, i) {
					return  y(d[buildStyle.dataVal]);
				});
			//exit
			this.selectAll('.trendline')
				.data(params.data)
				.exit()
				.remove();
			this.selectAll('.point')
				.data(params.data)
				.exit()
				.remove();

		this.selectAll('.bar-label')
			.data(params.data)
			.enter()
			  .append('text')
			  .classed('bar-label', true)
			  .attr('x', function(d, i){
				return x(d[buildStyle.dataKey]) + (x.rangeBand()/2);
			  })
			   .attr('y', function(d, i){
				return y(d[buildStyle.dataVal]);
			  })
			  .attr('dx', -19)
			  .attr('dy', -20)
			  .text(function(d, i){
				return d[buildStyle.dataVal];
			  });
		};
		plot.call(chart,{
			data: data,
			axis: {
				x: xAxis,
				y: yAxis
			}, 
			gridlines: yGridlines
		});
		if (buildStyle.isIssue)
			$('#line-chart').hide();
		else
			$('#pulls-line-chart').hide();
	}
	pointListener();
}

var assignLineListener = function(elem) {
	$(elem).click(function() {
		$( '#chart').toggle( "slow" );
		var els = document.getElementById('line-chart');
		var $els = $('#line-chart');
		
		$( '#line-chart').toggle( "slow" );
	var el2 = document.getElementById('pulls-line-chart');
	var ca = document.getElementById('chartArea');
	if (ca.style.display === 'none') {
		$( '#pulls-line-chart').toggle( "slow" );
		$( '#pulls-chart').toggle( "slow" );
	}
		setTimeout(function(){
			if ($els.is(":visible")) {
					$('.line-btn').text('View Bar Chart');
				} else {
					$('.line-btn').text('View Line Chart');
				}
		 }, 800	);
	});
};

var assignListener = function(elem) {
	$(elem ).click(function() {
	  $( '#chartArea').toggle( "slow" );
	 var el = document.getElementById('chartArea');
		$('#chartArea2').toggle('slow');
		 setTimeout(function(){
			if(el.style.display === 'none') {
					$('.btn').text('View Issues');
				} else {
					$('.btn').text('View Pull Requests');
				}
		 }, 800	);
	});
};



var getMonthString = function(date) {
	var month;
	switch(date) {
		case '01':
		month = 'January';
		break;
		case '02':
			month = 'Febuary';
			break;
		case '03': 
			month = 'March';
			break;
		case '04':
			month = 'April';
			break;
		case '05':
			month = 'May';
			break;
		case '06':
			month = 'June';
			break;
		case '07':
			month = 'July';
			break;
		case '08':
			month = 'August';
			break;
		case '09':
			month = 'September';
			break;
		case '10':
			month = 'October';
			break;
		case '11':
			month = 'November';
			break;
		case '12':
			month = 'December';
			break;
		default:
			month = 'nonono';
			break;
	}
return month;

};

var nth = function(data ,cb) {
	var st = [1,21,31];
	var rd = [3,23];
	var nd = [2, 22];
	var th = [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,24,25,26,27,28,29,30];
	var val;

	_.reduce(st, function(prev, st){
		if(data == st){
			val = st + "st";
			cb(val);
		}
	}, 0);

	_.reduce(rd, function(prev, rd){
		if(data == rd){
			val = rd + "rd";
			cb(val);
		}
	}, 0);

	_.reduce(nd, function(prev, nd){
		if(data == nd){
			val = nd + "nd";
			cb(val);
		}
	}, 0);

	_.reduce(th, function(prev, th){
		if(data == th){
			val = th + "th";
			cb(val);
		}
	}, 0);
};
 
var getDayFormat = function(dd) {
	var d = new Date(dd);
	var n = d.getDay();
	var weekday = new Array(7);
	weekday[0]=  "Sun";
	weekday[1] = "Mon";
	weekday[2] = "Tue";
	weekday[3] = "Wed";
	weekday[4] = "Thu";
	weekday[5] = "Fri";
	weekday[6] = "Sat";
	var dayStr = weekday[n];
	return dayStr;
};

var splitDashDate = function(dte) {
    var dateSections = dte.split('-');
    return dateSections;
};

function assignPullButtons(){
	var $bt2 = $('.btn');
			$bt2.remove();
	var bt = document.getElementsByClassName('btn');
	if (bt[0] !== null) {
		var btn = document.createElement('button');
		$(btn).attr({
			width: 200,
			class: 'btn'	
		});
		$(btn).text('View Pull Requests');
		$viewEle.append(btn);
		assignListener($viewEle);
	}
}

function setIssueCompareSelection(histObj) {
	if($('.compare-issues-sel').length !== 1){
	$('.compare-issues-info').append('<select class=compare-issues-sel></select>');
	var $selection = $('.compare-issues-sel').css({cursor: 'pointer'}).append('<option>Compare Issues</option>');
	$selection.append(histObj.allRepoName.map(function(data){
		return '<option>' + data.name + '</option>';
	}));
	getSelectionValue($selection, histObj, true);
}
	//this construct is for a jqueryui style selectmenu
	//$(function() {
 	//	$selection.selectmenu();
 	//});
}




function setPullsCompareSelection(histObj) {
	if($('.compare-pulls-sel').length !== 1){
	$('.compare-pulls-info').append('<select class=compare-pulls-sel></select>');
	var $selection = $('.compare-pulls-sel').css({cursor: 'pointer'}).append('<option>Compare Pulls</option>');
	$selection.append(histObj.allRepoName.map(function(data){
		return '<option>' + data.name + '</option>';
	}));
	getSelectionValue($selection, histObj, false);
}
	//this construct is for a jqueryui style selectmenu
	//$(function() {
 	//	$selection.selectmenu();
 	//});
}

function getSelectionValue($selection, histObj, isIssue) {
	$selection.on('change', function(){
		var chosenVal = $(this).val();
		if(chosenVal !== 'Compare Issues' || chosenVal !== 'Compare Pulls') {
			if(isIssue)
				compareRepositories(chosenVal, histObj.allRepoIssueHistory, true);
			else
				compareRepositories(chosenVal, histObj.allRepoPullsHistory, false);
		}	
	});
}


var compareRepositories = function(repoName, allHistory, isIssue) {
	var historyArr = isIssue ? allHistory : allPullsHistory;
	var usedArray = isIssue ? issuesArr : pullsArr;
	var comparedArray = [];
	var team;
		for(var i = 0; i < historyArr.length; i++) {
		if(repoName === historyArr[i][0].team){
			for(var j = 0; j < historyArr[i].length; j++){
				var dayOfMonth = stripDate('day');
				var dom = dayOfMonth(historyArr[i][j].rawDate);
				team = historyArr[i][j].team;
				if(isIssue)
				comparedArray.push({'date': dom, 'issues': historyArr[i][j].issues, 'issues2': usedArray[j].issues});
				else
				comparedArray.push({'date': dom, 'pulls': historyArr[i][j].pulls, 'pulls2': usedArray[j].pulls});
			}
		}
	}
	setComparisonChart(usedArray, comparedArray, team, isIssue);
}

var setComparisonChart = function(oppData,data , team, isIssue) {
	var dataVal1 = isIssue ? 'issues' : 'pulls';
	var dataVal2 = isIssue ? 'issues2' : 'pulls2';
	var y_ax = isIssue ? 'No. of Issues' : 'No. of Pulls';
	var $repo = $('.current-repo').text();
	var toolTipValue = isIssue ? 'Open Issues' : 'Pull Requests';
	var $comparison = $('#compare-line-chart');
	$comparison.remove();
	var buildStyle = {
			w: chartWidth,
			h: lineChartHeight,
			top: 48,
    		bottom: 72,
		    left: 60,
		    right: 40,
		    padding: 20
	};
	//tool tip config
	var tip = d3.tip()
				  .attr('class', 'd3-tip')
				  .offset([-10, 0])
				  .html(function(d, i) {
				  	var date;
				  	nth(d.date, function(val) {
				  		date = val;
				  	});
				  	var s = dt[i].split('T');
				  	var dateBits = s[0].split('-');
	    			var da = s[0].substring(s[0].length, 8).trim();
					var monthStr = getMonthString(dateBits[1]);
					var str = (d[dataVal2] <= d[dataVal1]) ? "<span class=team1>▶</span> " + team + ": " + d[dataVal1] + "</span><br><br> <span class=line-tip><span class=team2>▶</span> " +  $repo + ": " + d[dataVal2] + "</span>":"<span class=team2>▶</span> " +  $repo + ": " + d[dataVal2] + "</span><br><br> <span class=line-tip><span class=team1>▶</span> " + team + ": " + d[dataVal1] + "</span>";
				    return "<span class=line-tip>Date: " + date + " " + monthStr + " " + dateBits[0] + "</span><br><br> <span class=chart-title>"+ toolTipValue+"</span><span class=line-tip><br><br>" + str;
				  });
	
    var width = buildStyle.w - buildStyle.left - buildStyle.right;
	var height = buildStyle.h - buildStyle.top - buildStyle.bottom;
	var svg = d3.select('.compareChart').append('svg')
				.attr('id', 'compare-line-chart')
				.attr('height', buildStyle.h + buildStyle.padding)
				.attr('width', buildStyle.w + buildStyle.padding)
				.style('padding-top', 30);
	svg.call(tip);
	var chart = svg.append('g')
					.classed('display', true)
					.attr('transform', 'translate('+ buildStyle.left+','+buildStyle.right+')');
		chart.append("text")
				.classed('issues-title', true)
		        .attr("x", (width / 2))             
		        .attr("y", 0 - (buildStyle.top / 2) - 20)
		        .attr("text-anchor", "middle")
		        .text($repo + "  - vs -  " + team);
		        appendLegend($repo, team);
		var y = d3.scale.linear()
				.domain([0,d3.max(data, function(d) {
					return Math.max(d[dataVal1], d[dataVal2]);
				})])
				.range([height, 0]);
		var x = d3.scale.ordinal()
				.domain(data.map(function(entry) {
				return entry.date;
				}))
				.rangeBands([buildStyle.padding, width - buildStyle.padding]);


		var xAxis = d3.svg.axis()
						.scale(x)
						.orient('bottom');
		var frm = d3.format("0d");
		var yAxis = d3.svg.axis()
				.scale(y)
				.tickFormat(frm)
				.orient('left');
		var line = d3.svg.line()
					.x(function(d){
						return x(d.date);
					})
					.y(function(d){
						return y(d[dataVal1]);
					})
					.interpolate('cardinal');
		var line2 = d3.svg.line()
					.x(function(d){
						return x(d.date);
					})
					.y(function(d){
						return y(d[dataVal2]);
					})
					.interpolate('cardinal');
		var yGridlines = d3.svg.axis()
					.scale(y)
					.tickSize(-width, 0, 0)
					.tickFormat('')
					.orient('left');
	function plot(params) {
				this.append('g')
				.call(params.gridlines)
				.classed('gridline', true)
				.attr('transform', 'translate(0,0)');
				this.append('g')
			    .classed('x axis', true)
			    .attr('transform', 'translate(' + (-16 )+ ',' + (height +10)+ ')') //added -16 here to move x-axis left slightly
			    .call(params.axis.x)
				.selectAll('text')
				    .style('text-anchor', 'end')
				    .attr('dx', -8)
				    .attr('dy', 8)
				    .attr('transform', 'translate(0,0) rotate(-45)');
		this.append('g')
		    .classed('y axis', true)
		    .attr('transform', 'translate(-10,0)')//added -10 here to move y-axis left slightly
		    .call(params.axis.y);
		this.select('.y.axis')
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.style('text-anchor', 'middle')
			.attr('transform', 'translate(-40, ' + height / 2 +') rotate(-90)')
			.text(y_ax);
		this.select('.x.axis')
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.classed('line-x-axis-title', true)
			.style('text-anchor', 'middle')
			.attr('transform', 'translate(' + width / 2 + ', 50)')
			.text('Last 30 days');
			//enter
			this.selectAll('.trendline1')
				.data([params.data])
				.enter()
				.append('path')
				.classed('trendline1', true);
			this.selectAll('.point')
				.data(params.data)
				.enter()
				.append('circle')
				.classed('point', true)
				.attr('r', 3)
				.attr('value', function(d){
					return d.date + " " + d[dataVal1];
				})
				.on('mouseover', tip.show)
      				.on('mouseout', tip.hide);
			//update
			this.selectAll('.trendline1')
				.attr('d', function(d){
					return line(d);
				});
			this.selectAll('.point')
				.attr('cx', function(d, i) {
					return x(d.date);
				})
				.attr('cy', function(d, i) {
					return  y(d[dataVal1]);
				});
			//exit
			this.selectAll('.trendline1')
				.data(params.data)
				.exit()
				.remove();
			this.selectAll('.point')
				.data(params.data)
				.exit()
				.remove();

			this.selectAll('.trendline2')
				.data([params.data])
				.enter()
				.append('path')
				.classed('trendline2', true);
			this.selectAll('.point2')
				.data(params.data)
				.enter()
				.append('circle')
				.classed('point2', true)
				.attr('r', 3)
				.attr('value', function(d){
					return d.date + " " + d[dataVal2];
				})
				.on('mouseover', tip.show)
      				.on('mouseout', tip.hide);
			//update
			this.selectAll('.trendline2')
				.attr('d', function(d){
					return line2(d);
				});
			this.selectAll('.point2')
				.attr('cx', function(d, i) {
					return x(d.date);
				})
				.attr('cy', function(d, i) {
					return  y(d[dataVal2]);
				});

			//exit
			this.selectAll('.trendline2')
				.data(params.data)
				.exit()
				.remove();
			this.selectAll('.point2')
				.data(params.data)
				.exit()
				.remove();

		}
		plot.call(chart,{
			data: data,
			data2: oppData,
			axis: {
				x: xAxis,
				y: yAxis
			}, 
			gridlines: yGridlines
		});

  pointListener();
};

var setUpMultipleCompareBtn = function(histObj) {
	$('.multi-comparison').append('<button class=trigger-multi-compare>Compare Multiple Repos</button><div class=check-append></div>');
	var $btn = $('.trigger-multi-compare');
	$btn.on('click', function() {
		$btn.remove();
		$('.multi-comparison').prepend('<button class=go-compare>GO</button>');
		setMultiComparisonCheck(histObj);
		var $go = $('.go-compare');
		$go.on('click', function() {
			getCheckValues(histObj);
		});

	});
};

var setMultiComparisonCheck = function(histObj) {
	var data = histObj.allRepoIssueHistory;
	var i = 1;
	if($('.multi-compare').length === 0){
		_.map(data, function(val){
			$('.check-append').append('<input type=checkbox id=compare'+(i)+ ' class=multi-compare name=issue-multi-compare value='+ val[0].team+'><label class=multi-compare-text for=compare'+(i++)+ '>'+ val[0].team+'</label><br>');
		});
	}
};

var getCheckValues = function(histObj) {
	var colors = [];
	var color;
	var obj = histObj.allRepoIssueHistory;
	var maximum = 0;
	_.map(obj, function(data) {
		_.map(data, function(value) {
			if(parseInt(value.issues) > maximum) {
				maximum = value.issues;
			}
		});
	});

	var currentRepo = $('.current-repo').text();
	var teams = [];
	var checkedRepoData = [];
	var checkedVals = $('.multi-compare:checkbox:checked').map(function() {
    return this.value;
	}).get();
	_.map(checkedVals, function(name) {
		for(var i = 0; i < obj.length; i++) {
			if(name === obj[i][0].team) {
				checkedRepoData.push(obj[i]);
			}
		}
	});

	var comparedArray = [];
	var team, multicomparedArray = [];
	for(var i = 0; i < checkedRepoData.length; i++) {
		var nameOfRepo = checkedRepoData[i][0].team;
		var j = 0;
		if(i === 0) {
			color = Math.floor(10 * 100 * 17215).toString(16)
		} else {
			color = Math.floor(i * 100 * 17215).toString(16)
		}	
		color = color.substring(0,6)
		colors.push(color);
		var dd = checkedRepoData[i].map(function(val) {
			var dayOfMonth = stripDate('day');
			var dom = dayOfMonth(val.rawDate);
			return  {'date': dom, 'team': val.team, 'issues': val.issues, 'issues2': issuesArr[j++].issues, 'designatedColor': colors[i]};
		})
			teams.push(dd)
	}
	setComparisonChart2(pullsArr, teams, team, maximum, true);
}

var setComparisonChart2 = function(oppData, data, team, maximum, isIssue) {	
	var dataVal1 = isIssue ? 'issues' : 'pulls';
	var dataVal2 = isIssue ? 'issues2' : 'pulls2';
	var team = 'unknown';
	var y_ax = isIssue ? 'No. of Issues' : 'No. of Pulls';
	var $repo = $('.current-repo').text();
	var toolTipValue = isIssue ? 'Open Issues' : 'Pull Requests';
	var $comparison = $('#compare-line-chart');
	$comparison.remove();
	var buildStyle = {
			w: chartWidth,
			h: 500,
			top: 48,
    		bottom: 72,
		    left: 60,
		    right: 40,
		    padding: 20
	};
	//tool tip config
	var tip = d3.tip()
				  .attr('class', 'd3-tip')
				  .offset([-10, 0])
				  .html(function(d, i) {
				  	var date;
				  	nth(d.date, function(val) {
				  		date = val;
				  	});
				  	
				  	var s = dt[i].split('T');
				  	var dateBits = s[0].split('-');
	    			var da = s[0].substring(s[0].length, 8).trim();
					var monthStr = getMonthString(dateBits[1]);
					var str = (d[dataVal2] <= d[dataVal1]) ? "<span class=team1compare style=\'color:"+d['designatedColor']+"\'>▶</span> " + d['team'] + ": " + d[dataVal1] + "</span><br><br> <span class=line-tip><span class=team2compare>▶</span> " +  $repo + ": " + d[dataVal2] + "</span>":"<span class=team2compare>▶</span> " +  $repo + ": " + d[dataVal2] + "</span><br><br> <span class=line-tip><span class=team1compare style=\'color:"+d['designatedColor']+"\'>▶</span> " + d['team'] + ": " + d[dataVal1] + "</span>";
				    return "<span class=line-tip>Date: " + date + " " + monthStr + " " + dateBits[0] + "</span><br><br> <span class=chart-title>"+ toolTipValue+"</span><span class=line-tip><br><br>" + str;
				  });
	
    var width = buildStyle.w - buildStyle.left - buildStyle.right;
	var height = buildStyle.h - buildStyle.top - buildStyle.bottom;
	var svg = d3.select('.compareChart').append('svg')
				.attr('id', 'compare-line-chart')
				.attr('height', buildStyle.h + buildStyle.padding)
				.attr('width', buildStyle.w + buildStyle.padding)
				.style('padding-top', 30);
	svg.call(tip);


	for (var m = 0; m < data.length; m++) {
	
	var chart = svg.append('g')
					.classed('display', true)
					.attr('transform', 'translate('+ buildStyle.left+','+buildStyle.right+')');
		chart.append("text")
				.classed('issues-title', true)
		        .attr("x", (width / 2))             
		        .attr("y", 0 - (buildStyle.top / 2) - 20)
		        .attr("text-anchor", "middle")
		        .text($repo + "  Open Issues Comparison");
		        appendMultipleLegend($repo, team, data);
		var y = d3.scale.linear()
				.domain([0,d3.max(data[m], function(d) {
					return maximum;
				})])
				.range([height, 0]);
		var x = d3.scale.ordinal()
				.domain(data[m].map(function(entry) {
				return entry.date;
				}))
				.rangeBands([buildStyle.padding, width - buildStyle.padding]);


		var xAxis = d3.svg.axis()
						.scale(x)
						.orient('bottom');
		var frm = d3.format("0d");
		var yAxis = d3.svg.axis()
				.scale(y)
				.tickFormat(frm)
				.orient('left');
		var line = d3.svg.line()
					.x(function(d){
						return x(d.date);
					})
					.y(function(d){
						return y(d[dataVal1]);
					})
					.interpolate('cardinal');
		var line2 = d3.svg.line()
					.x(function(d){
						return x(d.date);
					})
					.y(function(d){
						return y(d[dataVal2]);
					})
					.interpolate('cardinal');
		var yGridlines = d3.svg.axis()
					.scale(y)
					.tickSize(-width, 0, 0)
					.tickFormat('')
					.orient('left');
	var $tix = $('.ticks')
	$tix.remove();
	function plot(params) {
				this.append('g')
				.call(params.gridlines)
				.classed('gridline', true)
				.attr('transform', 'translate(0,0)');
				this.append('g')
			    .classed('x axis', true)
			    .attr('transform', 'translate(' + (-16 )+ ',' + (height +10)+ ')') //added -16 here to move x-axis left slightly
			    .call(params.axis.x)
				.selectAll('text')
				    .style('text-anchor', 'end')
				    .attr('dx', -8)
				    .attr('dy', 8)
				    .attr('transform', 'translate(0,0) rotate(-45)');
		this.append('g')
		    .classed('y axis ticks', true)
		    .attr('transform', 'translate(-10,0)')//added -10 here to move y-axis left slightly
		    .call(params.axis.y);
		this.select('.y.axis')
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.style('text-anchor', 'middle')
			.attr('transform', 'translate(-40, ' + height / 2 +') rotate(-90)')
			.text(y_ax);
		this.select('.x.axis')
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.classed('line-x-axis-title', true)
			.style('text-anchor', 'middle')
			.attr('transform', 'translate(' + width / 2 + ', 50)')
			.text('Last 30 days');
		//set trendline 1	
		
			this.selectAll('.trendline1compare' + m)
				.data([params.data])
				.enter()
				.append('path')
				.classed('trendline1compare'+ m, true);
			this.selectAll('.point')
				.data(params.data)
				.enter()
				.append('circle')
				.classed('point', true)
				.attr('r', 3)
				.attr('value', function(d, i){
					setTrendLineColor(m, d['designatedColor']);
					return d.date + " " + d[dataVal1] + " " +d['team'] + " " + m;
				})
				.on('mouseover', tip.show)
      				.on('mouseout', tip.hide);
			//update
			this.selectAll('.trendline1compare'+ m)
				.attr('d', function(d){
					return line(d);
				});
			this.selectAll('.point')
				.attr('cx', function(d, i) {
					return x(d.date);
				})
				.attr('cy', function(d, i) {
					return  y(d[dataVal1]);
				});
			//exit
			this.selectAll('.trendline1compare'+ m)
				.data(params.data)
				.exit()
				.remove();
			this.selectAll('.point')
				.data(params.data)
				.exit()
				.remove();

			this.selectAll('.trendline2compare')
				.data([params.data])
				.enter()
				.append('path')
				.classed('trendline2compare', true);
			this.selectAll('.point2')
				.data(params.data)
				.enter()
				.append('circle')
				.classed('point2', true)
				.attr('r', 3)
				.attr('value', function(d){
					return d.date + " " + d[dataVal2] + " " +d['team'];
				})
				.on('mouseover', tip.show)
      				.on('mouseout', tip.hide);
			//update
			this.selectAll('.trendline2compare')
				.attr('d', function(d){
					return line2(d);
				});
			this.selectAll('.point2')
				.attr('cx', function(d, i) {
					return x(d.date);
				})
				.attr('cy', function(d, i) {
					return  y(d[dataVal2]);
				});

			//exit
			this.selectAll('.trendline2compare')
				.data(params.data)
				.exit()
				.remove();
			this.selectAll('.point2')
				.data(params.data)
				.exit()
				.remove();
		}
		plot.call(chart,{
			data: data[m],
			data2: oppData,
			axis: {
				x: xAxis,
				y: yAxis
			}, 
			gridlines: yGridlines
		});
}
  pointListener();
};


var stripDate = function(section) {
	return function(dateString) {
		var strArr = dateString.split('T');
	    var da = strArr[0].substring(strArr[0].length, 8).trim();
	    var arr = strArr[0].split('-');
	    if(section == 'day')
	    	return arr[2];
	    else if(section == 'month')
	    	return arr[1];
	};
};

var pointListener = function() {

	var $point = $('.point');
	$point.on('mouseover', function(){
		$(this).animate({
			'r':6
		})
		.css({
			'fill': '#2d57ca'
		});
	});

	var $point2 = $('.point2');
	$point2.on('mouseover', function(){
		$(this).animate({
			'r':6
		})
		.css({
			'fill': '#2d57ca'
		});
	});

	$point.on('mouseleave', function(){
		
		$(this).animate({
			'r':3
		})
		.css({
			'fill': '#000'
		});
	});

	$point2.on('mouseleave', function(){
		
		$(this).animate({
			'r':3
		})
		.css({
			'fill': '#000'
		});
	});
};

var appendLegend = function(thisRepo, otherRepo) {
	refreshLegend();	
	var $elt = $('.comparison-legend');
	$elt.prepend($('<svg class=home width=10 height=10><rect class=home width=10 height=10 /></rect></svg><span class=text-title >'+thisRepo+'</span><br class=break><svg class=away width=10 height=10><rect class=away width=10 height=10 /><rect></svg><span class=text-title >'+otherRepo+'</span>'));
};

var appendMultipleLegend = function(thisRepo, team, data) {
	refreshMultipleLegend();	
	var $elt = $('.multi-comparison-legend');
	$elt.prepend($('<br class=multi-break><br class=multi-break><br class=multi-break><svg class=multi-home width=10 height=10><rect class=multi-home width=10 height=10 /></rect></svg><span class=multi-text-title > '+thisRepo+'</span><br class=multi-break>'));

	$elt.append(_.map(data, function(repo){
		console.log(repo[0].team)
		return '<svg class=multi-away width=10 height=10><rect class=multi-away width=10 height=10 style=fill:#'+repo[0].designatedColor+'/><rect></svg><span class=multi-text-title > '+repo[0].team+'</span><br class=multi-break>'}));
}
var refreshLegend = function() {
	var $home = $('.home');
	var $away = $('.away');
	var $br = $('.break');
	var $title = $('.text-title ');
	$home.remove();
	$away.remove();
	$title.remove();
	$br.remove();
};

var refreshMultipleLegend = function() {
	var $multi_home = $('.multi-home');
	var $multi_away = $('.multi-away');
	var $multi_br = $('.multi-break');
	var $multi_title = $('.multi-text-title ');
	$multi_home.remove();
	$multi_away.remove();
	$multi_title.remove();
	$multi_br.remove();
};

function setTrendLineColor(num, colors) {
	var color = colors;
	var $elm = $('.trendline1compare' + num);
	$elm.attr('id', color)
	$elm.css({
		fill: 'none',
		stroke: '#' + color,
		strokeWidth: '1.5px',
	})
}


var getMonthAvg = function(data, target) {
	var total = _.reduce(data, function(acc, o) {
	    for (var p in o)
	        acc[p] = (p in acc ? acc[target] : 0) + o[target];
	    return acc;
	}, {});

	var totalAvg = Math.round(total[target] / data.length);
	return totalAvg;
};