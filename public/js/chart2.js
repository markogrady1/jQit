function setChart(data) {

var w = 800, h = 450;
var margin = {
	top: 20,
	bottom: 20,
	left: 20,
	right: 20
};
var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;
var x = d3.scale.linear()
	.domain([0, d3.max(data, function(d){
		return d.issues;	
	})])
	.range([0, width]);
var y = d3.scale.ordinal()
	.domain(data.map(function(entry){
		return entry.date;
	}))
	.rangeBands([0, height])
var linearColorScale = d3.scale.linear()
			.domain([0, data.length])
			.range(['#3182bd', '#c6dbef']);
var svg = d3.select('#chartArea').append('svg')
		.attr('id', 'chart')
		.attr('height', h)
		.attr('width', w)
var chart = svg.append('g')
		.classed('display', true)
		.attr('transform', 'translate(' + margin.left + ',' + margin.right + ')');

plot.call(chart, {data:data});
function plot(params) {
this.selectAll('.bar')
	.data(params.data)
	.enter()
	  .append('rect')
	  .classed('bar', true)
	  .attr('x', 0)
	  .attr('y', function(d, i){
		return y(d.date);
	  })
	  .attr('width', function(d, i){
		return x(d.issues);
	  })
	  .attr('height', function(d, i){
		return y.rangeBand()-1;
	  })
	  .style('fill', function(d, i){
		return linearColorScale(i)
	  });

this.selectAll('.bar-label')
	.data(params.data)
	.enter()
	  .append('text')
	  .classed('bar-label', true)
	  .attr('x', function(d, i){
		return x(d.issues);
	  })
	   .attr('y', function(d, i){
		return y(d.date);
	  })
	  .attr('dx', -4)
	  .attr('dy', function(d, i){
		return y.rangeBand() / 1.5 + 2;
	  })
	  .text(function(d, i){
		return d.issues;
	  });
}	
}	
