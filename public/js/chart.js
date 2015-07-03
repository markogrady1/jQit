function setChart(data) {

var w = 1100, h = 550;
var margin = {
	top: 40,
	bottom: 40,
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
//var x = d3.scale.linear()
//	.domain([0, d3.max(data, function(d){
//		return d.issues;	
//	})])
//	.range([0, width]);
//var y = d3.scale.ordinal()
//	.domain(data.map(function(entry){
//		return entry.date;
//	}))
//	.rangeBands([0, height])
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

plot.call(chart, {data:data});
function plot(params) {
this.append('g')
	.call(yGridlines)
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
//		return ordinalColorScale(i);//uncomment line for ordinalScale colours
		return linearColorScale(i)  //uncomment line for linearScale colours
	  });

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
	    .call(xAxis)
	this.append('g')
	    .classed('y axis', true)
	    .attr('transform', 'translate(0,0)')
	    .call(yAxis)
}	
}	
