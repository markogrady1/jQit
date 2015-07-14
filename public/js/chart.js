function setIssuesChart(data) {
var tot = 0;
    for (var m = 0; m < data.length; m++) {
	tot += data[m].issues;
    }

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



function setClosureChart(data) {
	var tot = 0;
	    for (var n = 0; n < data.length; n++) {
	        tot += data[n].closed; 
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
}




function barInfo(vData) {
	var issArr = [], dayArr = [];

	for (var p = 0; p<vData.length; p++) {
		issArr.push(vData[p].issues)
		dayArr.push(vData[p].date)
	}
console.log(issArr)
console.log(dayArr)
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
			console.log(issArr[t-1])
			progress = issArr[t] - issArr[t-1];
			if(progress < 0) {
				console.log('lower')
				progress = progress.toString().replace('-','')
				// progress = progress.replace('-', '')
				progressStr = '<span class=decrease>▼ </span>' + progress + ' since yesterday';
				console.log(progressStr)
			} else if (progress === 0) {
				progressStr = '<span class=same>▶ </span>No change';
				console.log(progressStr)
			} else {
				progressStr = '<span class=increase>▲ </span>'  + progress + ' since yesterday';
				console.log(progressStr)
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
	// $(ele).text(displayString + '\n\nNo. of Issues:    ' + arr[1] + '    cls' + progressStr + 'clsE');
	$(ele).html("<span class=\'displ-wrap\''>"+displayString + '</span><br><span class=displ-wrap><br>No. of Issues:    ' + arr[1] + '</span><br> <br><span class=red>'+ progressStr + '</span>');
	// $(ele).html($(ele).html().replace(/\n/g,'<br/>'));
	// $(ele).html($(ele).html().replace(/    /g,'&nbsp;&nbsp;&nbsp;'));
	// $(ele).html($(ele).html().replace(/cls/g,'<span class=red>;'));
	// $(ele).html($(ele).html().replace(/clsE/g,'</span>;'));
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
