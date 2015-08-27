'use strict';

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
	if(buildStyle.dataVal == 'issues')
		isIss = true;
	var chartId = buildStyle.isIssue ? "" : "pulls-";
	$viewEle = buildStyle.isIssue ? $('#changeView2') : $('#changeView');
	$viewEle.find('btn').remove();
	tot = _.reduce(data, function(sum, d){ return sum + d[buildStyle.dataVal]; }, 0 );
	var issuetmp = [];
	var pulltmp = [];
	for(var i = 0; i < data.length; i++) {
		if(buildStyle.dataVal == 'issues')
			issuetmp.push(data[i][buildStyle.dataVal]);
		else 
			pulltmp.push(data[i][buildStyle.dataVal]);
	}

	if (buildStyle.isIssue) totaller = tot;

	if (!buildStyle.isIssue){
		if (tot !== 0 && totaller !== 0) {
			assignPullButtons();
		}
	}

	if (tot !== 0) {
		if(buildStyle.isIssue) {
			setCompareSelection(histObj);
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
			if (typeof check != 'undefined') {
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
		
		$( '#line-chart').toggle( "slow" );
	var el2 = document.getElementById('pulls-line-chart');
	var ca = document.getElementById('chartArea');
	if (ca.style.display === 'none') {
		$( '#pulls-line-chart').toggle( "slow" );
		$( '#pulls-chart').toggle( "slow" );
	}
		setTimeout(function(){
			if (els.style.display === 'inline') {
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

function setCompareSelection(histObj) {
	if($('.compare-repo-sel').length !== 1){
	$('.compare-info').append('<select class=compare-repo-sel></select>');
	var $selection = $('.compare-repo-sel').css({cursor: 'pointer'}).append('<option>Compare Issues</option>');
	$selection.append(histObj.allRepoName.map(function(data){
		return '<option>' + data.name + '</option>';
	}));
	$selection.on('change', function(){
		var chosenVal = $(this).val();
		if(chosenVal !== 'Compare Issues')
			compareRepositories(chosenVal, histObj.allRepoHistory);
	});
}
	//this construct is for a jqueryui style selectmenu
	//$(function() {
 	//	$selection.selectmenu();
 	//});
}

var compareRepositories = function(repoName, allHistory) {
	var comparedArray = [];
	var team;
	for(var i = 0; i < allHistory.length; i++) {
		if(repoName === allHistory[i][0].team){
			for(var j = 0; j < allHistory[i].length; j++){
				var dayOfMonth = stripDate('day');
				var dom = dayOfMonth(allHistory[i][j].rawDate);
				team = allHistory[i][j].team;
				comparedArray.push({'date': dom, 'issues': allHistory[i][j].issues, 'issues2': issuesArr[j].issues});
			}
		}
	}
	setComparisonChart(issuesArr, comparedArray, team);
};

var setComparisonChart = function(oppData,data , team) {
	var $repo = $('.current-repo').text();
	var toolTipValue = "Open Issues";
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
					var str = (d.issues2 <= d.issues) ? "<span class=team1>▶</span> " + team + ": " + d.issues + "</span><br><br> <span class=line-tip><span class=team2>▶</span> " +  $repo + ": " + d.issues2 + "</span>":"<span class=team2>▶</span> " +  $repo + ": " + d.issues2 + "</span><br><br> <span class=line-tip><span class=team1>▶</span> " + team + ": " + d.issues + "</span>";
				    return "<span class=line-tip>Date: " + date + " " + monthStr + " " + dateBits[0] + "</span><br><br> <span class=chart-title>Open Issues</span><span class=line-tip><br><br>" + str;
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
					return Math.max(d.issues, d.issues2);
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
						return y(d.issues);
					})
					.interpolate('cardinal');
		var line2 = d3.svg.line()
					.x(function(d){
						return x(d.date);
					})
					.y(function(d){
						return y(d.issues2);
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
				.attr('transform', 'translate(0,0)')
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
			.text('No. of issues ');
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
					return d.date + " " + d.issues;
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
					return  y(d.issues);
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
					return d.date + " " + d.issues2;
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
					return  y(d.issues2);
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

var refreshLegend = function() {
	var $home = $('.home');
	var $away = $('.away');
	var $br = $('.break');
	var $title = $('.text-title ');
	$home.remove();
	$away.remove();
	$title.remove();
	$br.remove();
}