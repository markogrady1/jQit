var totaller;


function setIssuesChart(data) {
	var tot = 0;
	    for (var m = 0; m < data.length; m++) {
		tot += data[m].issues;
	    }
		totaller = tot;
	if (tot != 0) {
	issueStatus = true;
	var w = 1100, h = 550;
	var margin = {
		top: 48,
		bottom: 72,
		left: 60,
		right: 40
	};
	var width = w - margin.left - margin.right;
	var height = h - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.domain(data.map(function(entry){
			return entry.date;
		}))
		.rangeBands([0, width])
	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d){
			return d.issues;	
		})])
		.range([height, 0]);
	var yGridlines = d3.svg.axis()
				.scale(y)
				.tickSize(-width, 0, 0)
				.tickFormat('')
				.orient('left')
	var linearColorScale = d3.scale.linear()
				.domain([0, data.length])
				.range(['#4A84B0', '#c6dbef']);
	var ordinalColorScale = d3.scale.category20();
	var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom');
	var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left')
	var svg = d3.select('#chartArea').append('svg')
			.attr('id', 'chart')
			.attr('height', h)
			.attr('width', w)

	var chart = svg.append('g')
			.classed('display', true)
			.attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');
	chart.append("text")
			.classed('issues-title', true)
	        .attr("x", (width / 2))             
	        .attr("id", 'issues-title')             
	        .attr("y", 0 - (margin.top / 2))
	        .attr("text-anchor", "middle")  
	        .text("ISSUES");
	plot.call(chart, {
		data:data,
		axis: {
		    x: xAxis,
		    y: yAxis,
		}, 
		gridlines: yGridlines
	});
	} else {
	    issueStatus = false;
	} 

function plot(params) {
	this.append('g')
		.call(params.gridlines)
		.classed('gridline', true)
		.attr('transform', 'translate(0,0)')
	this.selectAll('.bar')
		.data(params.data)
		.enter()
		  .append('rect')
		  .classed('bar', true)
		  .attr('x', function(d, i){
			return x(d.date);
		  })
		  .attr('value', function(d, i) {
			return d.date  + ' ' + d.issues;
		  })
		  .attr('y', function(d, i){
			return y(d.issues);
		  })
		  .attr('width', function(d, i){
			return x.rangeBand()-2;
		  })
		  .attr('height', function(d, i){
			return height - y(d.issues)
		  })
		  .style('fill', function(d, i){
			//return ordinalColorScale(i);//uncomment line for ordinalScale colours
			return linearColorScale(i)  //uncomment line for linearScale colours
		  })
		  .style('cursor', 'pointer');

	this.selectAll('.bar-label')
		.data(params.data)
		.enter()
		  .append('text')
		  .classed('bar-label', true)
		  .attr('x', function(d, i){
			return x(d.date) + (x.rangeBand()/2);
		  })
		   .attr('y', function(d, i){
			return y(d.issues);
		  })
		  .attr('dx', 0)
		  .attr('dy', -6)
		  .text(function(d, i){
			return d.issues;
		  })
	this.append('g')
	    .classed('x axis', true)
	    .attr('transform', 'translate(' + 0 + ',' + height + ')')
	    .call(params.axis.x)
		.selectAll('text')
		    .style('text-anchor', 'end')
		    .attr('dx', -8)
		    .attr('dy', 8)
		    .attr('transform', 'translate(0,0) rotate(-45)')
	this.append('g')
	    .classed('y axis', true)
	    .attr('transform', 'translate(0,0)')
	    .call(params.axis.y)
	this.select('.y.axis')
		.append('text')
		.attr('x', 0)
		.attr('y', 0)
		.style('text-anchor', 'middle')
		.attr('transform', 'translate(-50, ' + height / 2 +') rotate(-90)')
		.text('No. of Issues')
	this.select('.x.axis')
		.append('text')
		.attr('x', 0)
		.attr('y', 0)
		.style('text-anchor', 'middle')
		.attr('transform', 'translate(' + width / 2 + ', 50)')
		.text('Last 30 Days')
		
	}	
}


function setPullsChart(data) {
	var tot = 0;
	    for (var n = 0; n < data.length; n++) {
	        tot += data[n].pulls; 
	    }
	    if (tot != 0 && totaller != 0) {

		var $viewEle = $('#changeView')
		var btn = document.createElement('button');
		$(btn).attr({
			width: 200,
			class: 'btn'	
		});

		$(btn).text('View Pull Requests');
		$viewEle.append(btn);
		assignListener($viewEle);
	    }
	    if (tot != 0) {
	        var w = 450, h = 450;
	        var margin = {
		    top: 48,
		    bottom: 100,
		    left: 60,
		    right: 40
	        };
	var width = w - margin.left - margin.right;
	var height = h - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.domain(data.map(function(entry){
			return entry.date;
		}))
		.rangeBands([0, width])
	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d){
			return d.pulls;	
		})])
		.range([height, 0]);
	var yGridlines = d3.svg.axis()
				.scale(y)
				.tickSize(-width, 0, 0)
				.tickFormat('')
				.orient('left')
	var linearColorScale = d3.scale.linear()
				.domain([0, data.length])
				.range(['#4A84B0', '#c6dbef']);
	var ordinalColorScale = d3.scale.category20();
	var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom');
	var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left')
	var svg = d3.select('#chartArea2').append('svg')
			.attr('id', 'chart')
			.attr('height', h)
			.attr('width', w)
	var chart = svg.append('g')
			.classed('display', true)
			.attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');
	chart.append("text")
				.classed('pulls-title', true)
		        .attr("x", (width / 2))             
		        .attr("id", 'pulls-title')             
		        .attr("y", 0 - (margin.top / 2))
		        .attr("text-anchor", "middle")  
		        .text("PULL REQUESTS");
	plot2.call(chart, {
		data:data,
		axis: {
		    x: xAxis,
		    y: yAxis,
		}, 
		gridlines: yGridlines
	});
	}
	function plot2(params) {
		this.append('g')
			.call(params.gridlines)
			.classed('gridline', true)
			.attr('transform', 'translate(0,0)')
		this.selectAll('.bar')
			.data(params.data)
			.enter()
			  .append('rect')
			  .classed('bars', true)
			  .attr('x', function(d, i){
				return x(d.date);
			  })
			  .attr('value', function(d, i) {
				return d.date  + ' ' + d.pulls;
		  	  })
			  .attr('y', function(d, i){
				return y(d.pulls);
			  })
			  .attr('width', function(d, i){
				return x.rangeBand()-2;
			  })
			  .attr('height', function(d, i){
				return height - y(d.pulls)
			  })
			  .style('fill', function(d, i){
				//return ordinalColorScale(i);//uncomment line for ordinalScale colours
				return linearColorScale(i)  //uncomment line for linearScale colours
			  })
			  .style('cursor', 'pointer');

		this.selectAll('.bar-label')
			.data(params.data)
			.enter()
			  .append('text')
			  .classed('bar-label', true)
			  .attr('x', function(d, i){
				return x(d.date) + (x.rangeBand()/2);
			  })
			   .attr('y', function(d, i){
				return y(d.pulls);
			  })
			  .attr('dx', 0)
			  .attr('dy', -6)
			  .text(function(d, i){
				return d.pulls;
			  })
			this.append('g')
			    .classed('x axis', true)
			    .attr('transform', 'translate(' + 0 + ',' + height + ')')
			    .call(params.axis.x)
				.selectAll('text')
				    .style('text-anchor', 'end')
				    .attr('dx', -8)
				    .attr('dy', 8)
				    .attr('transform', 'translate(0,0) rotate(-45)')
			this.append('g')
			    .classed('y axis', true)
			    .attr('transform', 'translate(0,0)')
			    .call(params.axis.y)
			this.select('.y.axis')
				.append('text')
				.attr('x', 0)
				.attr('y', 0)
				.style('text-anchor', 'middle')
				.attr('transform', 'translate(-50, ' + height / 2 +') rotate(-90)')
				.text('No. of Pull Requests')
			this.select('.x.axis')
				.append('text')
				.attr('x', 0)
				.attr('y', 0)
				.style('text-anchor', 'middle')
				.attr('transform', 'translate(' + width / 2 + ', 60)')
				.text('Last 30 Days')
		}	
	$('#chartArea2').hide();
}


function setClosureChart(data) {
	var tot = 0;
	    for (var n = 0; n < data.length; n++) {
	        tot += data[n].closed; 
	    }
	    if (tot != 0 && totaller != 0) {

		var $viewEle = $('#changeView')
		var btn = document.createElement('button');
		$(btn).attr({
			width: 200,
			class: 'btn'	
		});
		
		$viewEle.append(btn);
		assignListener($viewEle);
	    }
	    if (tot != 0) {
	        var w = 450, h = 450;
	        var margin = {
		    top: 48,
		    bottom: 100,
		    left: 60,
		    right: 40
	        };
	var width = w - margin.left - margin.right;
	var height = h - margin.top - margin.bottom;

	var x = d3.scale.ordinal()
		.domain(data.map(function(entry){
			return entry.user;
		}))
		.rangeBands([0, width])
	var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d){
			return d.closed;	
		})])
		.range([height, 0]);
	var yGridlines = d3.svg.axis()
				.scale(y)
				.tickSize(-width, 0, 0)
				.tickFormat('')
				.orient('left')
	var linearColorScale = d3.scale.linear()
				.domain([0, data.length])
				.range(['#4A84B0', '#c6dbef']);
	var ordinalColorScale = d3.scale.category20();
	var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom');
	var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left')
	var svg = d3.select('#chartArea2').append('svg')
			.attr('id', 'chart')
			.attr('height', h)
			.attr('width', w)
	var chart = svg.append('g')
			.classed('display', true)
			.attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

	plot2.call(chart, {
		data:data,
		axis: {
		    x: xAxis,
		    y: yAxis,
		}, 
		gridlines: yGridlines
	});
	}

	function plot2(params) {
		this.append('g')
			.call(params.gridlines)
			.classed('gridline', true)
			.attr('transform', 'translate(0,0)')
		this.selectAll('.bar')
			.data(params.data)
			.enter()
			  .append('rect')
			  .classed('bar', true)
			  .attr('x', function(d, i){
				return x(d.user);
			  })
			  .attr('y', function(d, i){
				return y(d.closed);
			  })
			  .attr('width', function(d, i){
				return x.rangeBand()-2;
			  })
			  .attr('height', function(d, i){
				return height - y(d.closed)
			  })
			  .style('fill', function(d, i){
				//return ordinalColorScale(i);//uncomment line for ordinalScale colours
				return linearColorScale(i)  //uncomment line for linearScale colours
			  });

		this.selectAll('.bar-label')
			.data(params.data)
			.enter()
			  .append('text')
			  .classed('bar-label', true)
			  .attr('x', function(d, i){
				return x(d.user) + (x.rangeBand()/2);
			  })
			   .attr('y', function(d, i){
				return y(d.closed);
			  })
			  .attr('dx', 0)
			  .attr('dy', -6)
			  .text(function(d, i){
				return d.closed;
			  })
			this.append('g')
			    .classed('x axis', true)
			    .attr('transform', 'translate(' + 0 + ',' + height + ')')
			    .call(params.axis.x)
				.selectAll('text')
				    .style('text-anchor', 'end')
				    .attr('dx', -8)
				    .attr('dy', 8)
				    .attr('transform', 'translate(0,0) rotate(-45)')
			this.append('g')
			    .classed('y axis', true)
			    .attr('transform', 'translate(0,0)')
			    .call(params.axis.y)
			this.select('.y.axis')
				.append('text')
				.attr('x', 0)
				.attr('y', 0)
				.style('text-anchor', 'middle')
				.attr('transform', 'translate(-50, ' + height / 2 +') rotate(-90)')
				.text('No. of Closures')
			this.select('.x.axis')
				.append('text')
				.attr('x', 0)
				.attr('y', 0)
				.style('text-anchor', 'middle')
				.attr('transform', 'translate(' + width / 2 + ', 100)')
				.text('User')
		}	
	$('#chartArea2').hide();
}



var assignListener = function(elem) {
	var text;
$(elem ).click(function() {
  $( '#chartArea').toggle( "slow" );
 var el = document.getElementById('chartArea');
	$('#chartArea2').toggle('slow');
	 setTimeout(function(){
		if(el.style.display === 'block') {
				$('.btn').text('View Pull Requests')
			} else {
				$('.btn').text('View Issues')
			}
	 }, 800	)
});

	
}

function issueBarInfo(vData) {
	var issArr = [], dayArr = [];

	for (var p = 0; p<vData.length; p++) {
		issArr.push(vData[p].issues)
		dayArr.push(vData[p].date)
	}
	var mouseX, mouseY;
	$(document).mousemove(function(e) {
	    mouseX = e.pageX;
	    mouseY = e.pageY;
	}).mouseover(); 

	var $singleBar = $('.bar');
	var e;
	$singleBar.on('mouseover', function() {
		e = $(this).css('fill');
		$(this).css('fill', '#3C7BD5');

	});

	$singleBar.on('click', function() {
	var title = $(this).attr('value');
	var arr = title.split(' ');
	var progress, progressStr;
	//seperate the date from the ISO format 
	for (var t in dt) {
	    var s = dt[t].split('T')
	    var da = s[0].substring(s[0].length, 8).trim()
	    var a = s[0].split('-')
	    if (da == arr[0]) {
		selectedBar = s[0];
		selectedDay = a[1]
		if (typeof issArr[t-1] != 'undefined') {
			progress = issArr[t] - issArr[t-1];
			if(progress < 0) {
				progress = progress.toString().replace('-','')
				progressStr = '<span class=decrease>▼ </span>' + progress + ' since yesterday';
			} else if (progress === 0) {
				progressStr = '<span class=same>▶ </span>No change';
			} else {
				progressStr = '<span class=increase>▲ </span>'  + progress + ' since yesterday';
			}
		} else {
			progressStr = '';
		}
	    }
	}

	var dayString = getDayFormat(selectedBar);
	var monthString = dateFormat(selectedDay);
	var dateArray = splitDashDate(selectedBar);
	var displayString = dayString + ' ' + dateArray[2] + ' ' +  monthString + ' ' + a[0];

	//arr[0] contains the day of issues amount
	//arr[1] contains the amount of issues for that day
	var bdy = document.getElementsByTagName('header')
	var ele = document.createElement('div');
	$(ele).html("<span class=\'displ-wrap\''>Date:    "+displayString + '</span><br><span class=displ-wrap><br>No. of Issues:    ' + arr[1] + '</span><br> <br><span class=red>'+ progressStr + '</span>');
	$(ele).attr('class', 'display-data');
	$(ele).css({
		position: 'absolute',
		center: mouseY +100,
		fontSize: '1em',
		left: mouseX,
		width: '150px',
		height: '75px',
		backgroundColor: '#3a3a3a',
		color: '#cacaca',
		border: '2px solid #a3a3a3',
		innerHTML: arr[0],
		margin: '10px',
		padding: '15px',
		borderRadius: '8px'
	 }).fadeIn(200)
	$(bdy[0]).append(ele);
	});
	$singleBar.on('mouseleave', function(){
		$('.display-data').remove();
		$(this).css('fill', e);
	});
}


function pullBarInfo(vData) {
	var selectedBar = '';
	var selectedDay = '';
	var issArr = [], dayArr = [];

	for (var p = 0; p<vData.length; p++) {
		issArr.push(vData[p].pulls)
		dayArr.push(vData[p].date)
	}
	var mouseX, mouseY;
	$(document).mousemove(function(e) {
	    mouseX = e.pageX;
	    mouseY = e.pageY;
	}).mouseover(); 

	var $singleBar = $('.bars');
	var e;
	$singleBar.on('mouseover', function() {
		e = $(this).css('fill');
		$(this).css('fill', '#3C7BD5');

	});

	$singleBar.on('click', function() {
	var title = $(this).attr('value');
	var arr = title.split(' ');
	var prog, progressStr;
	//seperate the date from the ISO format 
	for (var t in pdt) {
	    var s = pdt[t].split('T')
	    var da = s[0].substring(s[0].length, 8).trim()
	    var a = s[0].split('-')
	    if (da == arr[0]) {
		selectedBar = s[0];
		selectedDay = a[1]
		if (typeof issArr[t-1] != 'undefined') {
			prog = issArr[t] - issArr[t-1];
			if(prog < 0) {
				prog = prog.toString().replace('-','')
				progressStr = '<span class=decrease>▼ </span>' + prog + ' since yesterday';
			} else if (prog == 0) {
				progressStr = '<span class=same>▶ </span>No change';
			} else {
				progressStr = '<span class=increase>▲ </span>'  + prog + ' since yesterday';
			}
		} else {
			progressStr = '';
		}
	    }
	}

	var dayString = getDayFormat(selectedBar);
	var monthString = dateFormat(selectedDay);
	var dateArray = splitDashDate(selectedBar);
	var displayString = dayString + ' ' + dateArray[2] + ' ' +  monthString + ' ' + a[0];

	//arr[0] contains the day of pull request amount
	//arr[1] contains the amount of pull requests for that day
	var bdy = document.getElementsByTagName('header')
	var ele = document.createElement('div');
	$(ele).html("<span class=\'displ-wrap\''>Date:    "+displayString + '</span><br><span class=displ-wrap><br>Pull Requests:    ' + arr[1] + '</span><br> <br><span class=red>'+ progressStr + '</span>');
	$(ele).attr('class', 'display-data');
	$(ele).css({
		position: 'absolute',
		center: mouseY +100,
		fontSize: '1em',
		left: mouseX,
		width: '150px',
		height: '75px',
		backgroundColor: '#3a3a3a',
		color: '#cacaca',
		border: '2px solid #a3a3a3',
		innerHTML: arr[0],
		margin: '10px',
		padding: '15px',
		borderRadius: '8px'
	 }).fadeIn(200)
	$(bdy[0]).append(ele);
	});
	$singleBar.on('mouseleave', function(){
		$('.display-data').remove();
		$(this).css('fill', e);
	});
}

var dateFormat = function(date) {
	switch(date){
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

}


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
	var dayStr = weekday[n]
	return dayStr;
}

var splitDashDate = function(dte) {
    var dateSections = dte.split('-');
    return dateSections;
}
