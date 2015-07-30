var totaller;

function setIssuesLineChart(data) {
	var tot = 0;
	for (var i = 0; i < data.length; i++) {
		tot += data[i].issues;
	}
	if (tot != 0) {
		var w = 1100, h = 350;
		var padding = 0; //padding not needed right now
		var margin = {
			top: 48,
			bottom: 72,
			left: 60,
			right: 40
		};
		var tip = d3.tip()
				  .attr('class', 'd3-tip')
				  .offset([-10, 0])
				  .html(function(d, i) {
				  	var date = Nth(d.date)

				  	var s = dt[i].split('T')
				  	var dateBits = s[0].split('-');
	    			var da = s[0].substring(s[0].length, 8).trim()
					var monthStr = dateFormat(dateBits[1])
				    return "<span class=line-tip>Date: " + date + " " + monthStr + " " + dateBits[0] + "</span><br><br> <span class=line-tip>Pull Requests: " + d.issues + "</span>";
				  })
		var width = w - margin.left - margin.right;
		var height = h - margin.top - margin.bottom;
		var svg = d3.select('#chartArea').append('svg')
					.attr('id', 'line-chart')
					.attr('height', h + padding)
					.attr('width', w + padding)
		svg.call(tip);
		var chart = svg.append('g')
					.classed('display', true)
					.attr('transform', 'translate('+ margin.left+','+margin.right+')')
		chart.append("text")
				.classed('issues-title', true)
		        .attr("x", (width / 2))             
		        .attr("y", 0 - (margin.top / 2) -20)
		        .attr("text-anchor", "middle")  
		        .text("ISSUES");
		var y = d3.scale.linear()
				.domain([0,d3.max(data, function(d) {
					return d.issues;
				})])
				.range([height, 0])
		var x = d3.scale.ordinal()
				.domain(data.map(function(entry) {
				return entry.date;
				}))
				.rangeBands([padding, width - padding])

		var xAxis = d3.svg.axis()
				.scale(x)
				.orient('bottom')
		var frm = d3.format("0d")
		var yAxis = d3.svg.axis()
				.scale(y)
				.tickFormat(frm)
				.orient('left')
		var line = d3.svg.line()
					.x(function(d){
						return x(d.date)
					})
					.y(function(d){
						return y(d.issues)
					})
					.interpolate('cardinal')
		var yGridlines = d3.svg.axis()
					.scale(y)
					.tickSize(-width, 0, 0)
					.tickFormat('')
					.orient('left')
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
			    .attr('transform', 'translate(0,0) rotate(-45)')
		this.append('g')
		    .classed('y axis', true)
		    .attr('transform', 'translate(-10,0)')//added -10 here to move y-axis left slightly
		    .call(params.axis.y)
		this.select('.y.axis')
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.style('text-anchor', 'middle')
			.attr('transform', 'translate(-40, ' + height / 2 +') rotate(-90)')
			.text('No. of Issues')
		this.select('.x.axis')
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.style('text-anchor', 'middle')
			.attr('transform', 'translate(' + width / 2 + ', 50)')
			.text('Last 30 Days')
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
					return d.date + "  " + d.issues;
				})
				.on('mouseover', tip.show)
      				.on('mouseout', tip.hide);
			//update
			this.selectAll('.trendline')
				.attr('d', function(d){
					return line(d)
				})
			this.selectAll('.point')
				.attr('cx', function(d, i) {
					return x(d.date);
				})
				.attr('cy', function(d, i) {
					return  y(d.issues);
				})

			//exit
			this.selectAll('.trendline')
				.data(params.data)
				.exit()
				.remove()
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
				return x(d.date) + (x.rangeBand()/2);
			  })
			   .attr('y', function(d, i){
				return y(d.issues);
			  })
			  .attr('dx', -19)
			  .attr('dy', -20)
			  .text(function(d, i){
				return d.issues;
			  })
		}
		plot.call(chart,{
			data: data,
			axis: {
				x: xAxis,
				y: yAxis
			}, 
			gridlines: yGridlines
		});
	$('#line-chart').hide();
}
}

var setPullsLineChart = function(data) {
	var tot = 0;
	for (var i = 0; i < data.length; i++) {
		tot += data[i].pulls;
	}
	if (tot != 0) {
		var w = 450, h = 450;
		var padding = 0; //padding not needed right now
		var margin = {
			top: 48,
			bottom: 72,
			left: 60,
			right: 40
		};
		var width = w - margin.left - margin.right;
		var height = h - margin.top - margin.bottom;
		var tip = d3.tip()
				  .attr('class', 'd3-tip')
				  .offset([-10, 0])
				  .html(function(d, i) {
				  	var date = Nth(d.date)
				  	
				  	var s = pdt[i].split('T')
				  	var dateBits = s[0].split('-');
	    			var da = s[0].substring(s[0].length, 8).trim()
					var monthStr = dateFormat(dateBits[1])
				    return "<span class=line-tip>Date: " + date + " " + monthStr + " " + dateBits[0] + "</span><br><br> <span class=line-tip>Pull Requests: " + d.pulls + "</span>";
				  })
		var svg = d3.select('#chartArea2').append('svg')
					.attr('id', 'pulls-line-chart')
					.attr('height', h + padding)
					.attr('width', w + padding)
		svg.call(tip);
		var chart = svg.append('g')
					.classed('display', true)
					.attr('transform', 'translate('+ margin.left+','+margin.right+')')
		chart.append("text")
				.classed('pulls-title', true)
		        .attr("x", (width / 2))             
		        .attr("y", 0 - (margin.top / 2) -20)
		        .attr("text-anchor", "middle")  
		        .text("ISSUES");
		var y = d3.scale.linear()
				.domain([0,d3.max(data, function(d) {
					return d.pulls;
				})])
				.range([height, 0])
		var x = d3.scale.ordinal()
				.domain(data.map(function(entry) {
				return entry.date;
				}))
				.rangeBands([padding, width - padding])

		var xAxis = d3.svg.axis()
				.scale(x)
				.orient('bottom')
		var frm = d3.format("0d")
		var yAxis = d3.svg.axis()
				.scale(y)
				.tickFormat(frm)
				.orient('left')
		
		var line = d3.svg.line()
					.x(function(d){
						return x(d.date)
					})
					.y(function(d){
						return y(d.pulls)
					})
					.interpolate('cardinal')
		var yGridlines = d3.svg.axis()
					.scale(y)
					.tickSize(-width, 0, 0)
					.tickFormat('')
					.orient('left')
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
			    .attr('transform', 'translate(0,0) rotate(-45)')
		this.append('g')
		    .classed('y axis', true)
		    .attr('transform', 'translate(-10,0)')//added -10 here to move y-axis left slightly
		    .call(params.axis.y)
		this.select('.y.axis')
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.style('text-anchor', 'middle')
			.attr('transform', 'translate(-40, ' + height / 2 +') rotate(-90)')
			.text('No. of Issues')
		this.select('.x.axis')
			.append('text')
			.attr('x', 0)
			.attr('y', 0)
			.style('text-anchor', 'middle')
			.attr('transform', 'translate(' + width / 2 + ', 50)')
			.text('Last 30 Days')
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
				.attr('r', 4)
				.attr('value', function(d){
					return d.date + "  " + d.pulls;
				})
				.style('cursor', 'pointer')
				.on('mouseover', tip.show)
      			.on('mouseout', tip.hide);
			//update
			this.selectAll('.trendline')
				.attr('d', function(d){
					return line(d)
				})
			this.selectAll('.point')
				.attr('cx', function(d, i) {
					return x(d.date);
				})
				.attr('cy', function(d, i) {
					return  y(d.pulls);
				})

			//exit
			this.selectAll('.trendline')
				.data(params.data)
				.exit()
				.remove()
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
				return x(d.date) + (x.rangeBand()/2);
			  })
			   .attr('y', function(d, i){
				return y(d.pulls);
			  })
			  .attr('dx', -15)
			  .attr('dy', -20)
			  .text(function(d, i){
				return d.pulls;
			  })
		}
		plot.call(chart,{
			data: data,
			axis: {
				x: xAxis,
				y: yAxis
			}, 
			gridlines: yGridlines
		});
	$('#pulls-line-chart').hide();
}
}

var hideLineChart = function() {
	var $lineChart = $('#line-chart')
	$lineChart.css('display', 'none')
}



function setIssuesChart(data) {
	var tot = 0;
	    for (var m = 0; m < data.length; m++) {
			tot += data[m].issues;
	    }
		totaller = tot;
	if (tot != 0) {
		$viewEle = $('#changeView2');
		var lineBtn = document.createElement('button')
		$(lineBtn).text('View Line Chart')
		$viewEle.append(lineBtn);
		$(lineBtn).attr({
			width: 200,
			class: 'line-btn'	
		});
		
		$viewEle.append(lineBtn);
		assignLineListener(lineBtn);
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
	var frm = d3.format("0d")
	var yAxis = d3.svg.axis()
			.scale(y)
			.tickFormat(frm)
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
		  .on('mouseover', function(d, i){
		var el = d3.select(this)
			el.transition()
				.duration(300)
				.attr({
				width: x.rangeBand()+5,
				height:height - y(d.issues)+3,
				y: y(d.issues)-3
			})						
		 this.parentNode.appendChild(this); 
		  })
		  .on('mouseleave', function(d, i){
			var el = d3.select(this)
			el.transition()
				.duration(500)
				.attr({
				height: height - y(d.issues),
				y: y(d.issues),
				width:x.rangeBand()-2
			})						
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
	var frm = d3.format("0d")
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
			.tickFormat(frm)
			.orient('left')
	var svg = d3.select('#chartArea2').append('svg')
			.attr('id', 'pulls-chart')
			.attr('height', h)
			.attr('width', w)
	var chart = svg.append('g')
			.classed('display', true)
			.attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');
	chart.append("text")
				.classed('pulls-title', true)
		        .attr("x", (width / 2))             
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
		assignListener($viewEle, null);
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

var assignLineListener = function(elem) {
	$(elem).click(function() {
		$( '#chart').toggle( "slow" );
		var els = document.getElementById('line-chart');
		
		$( '#line-chart').toggle( "slow" );
		// $( '#pulls-line-chart').toggle( "slow" );

	var el2 = document.getElementById('pulls-line-chart');
	var ca = document.getElementById('chartArea');
	if(ca.style.display === 'none'){
		$( '#pulls-line-chart').toggle( "slow" );
		$( '#pulls-chart').toggle( "slow" );
	}
		setTimeout(function(){
			if(els.style.display === 'inline') {
					$('.line-btn').text('View Bar Chart')
				} else {
					$('.line-btn').text('View Line Chart')
				}
		 }, 800	)
	})
}

var assignListener = function(elem) {
	$(elem ).click(function() {
	  $( '#chartArea').toggle( "slow" );
	 var el = document.getElementById('chartArea');
		$('#chartArea2').toggle('slow');
		 setTimeout(function(){
			if(el.style.display === 'none') {
					$('.btn').text('View Issues')
				} else {
					$('.btn').text('View Pull Requests')
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
	var place = document.getElementById('display-data-info')
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
	$(place).append(ele);
	});

	$singleBar.on('mouseleave', function(){
		$('.display-data').remove();
		$(this).css('fill', e);
	});


var $point = $('.point');
$point.on('mouseover', function(){
	$(this).animate({
		'r':6
	})
	.css({
		'fill': '#2d57ca'
	})
})

$point.on('mouseleave', function(){
	
	$(this).animate({
		'r':4
	})
	.css({
		'fill': '#000'
	})
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
	var place = document.getElementById('display-data-info')
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
	$(place).append(ele);
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

var Nth = function(data) {
	var st = [1,21,31];
	var rd = [3,23];
	var nd = [2, 22]
	var th = [4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,24,25,26,27,28,29,30];

	for (var i = 0; i < st.length; i++) {
		if(data == st[i]){
			return st[i] + "st";
		}
	};
	for (var i = 0; i < rd.length; i++) {
		if(data == rd[i]){
			return rd[i] + "rd";
		}
	};
	for (var i = 0; i < nd.length; i++) {
		if(data == nd[i]){
			return nd[i] + "nd";
		}
	};
	for (var i = 0; i < th.length; i++) {
		if(data == th[i]){
			return th[i] + "th";
		}
	};
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
