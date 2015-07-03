function setChart(data) {
/*var data = [
	{key: "Glazed",		value: 132},
	{key: "Jelly",		value: 71},
	{key: "Holes",		value: 337},
	{key: "Sprinkles",	value: 93},
	{key: "Crumb",		value: 78},
	{key: "Chocolate",	value: 43},
	{key: "Coconut", 	value: 20},
	{key: "Cream",		value: 16},
	{key: "Cruller", 	value: 30},
	{key: "Éclair", 	value: 8},
	{key: "Fritter", 	value: 17},
	{key: "Bearclaw", 	value: 21}
];*/
var w = 800;
var h = 450;
var margin = {
	top: 58,
	bottom: 100,
	left: 80,
	right: 40
};
var width = w - margin.left - margin.right;
var height = h - margin.top - margin.bottom;

var x = d3.scale.ordinal()
		.domain(data.map(function(entry){
			return entry.date;
		}))
		.rangeBands([0, width]);
var y = d3.scale.linear()
		.domain([0, d3.max(data, function(d){
			return d.issues;
		})])
		.range([height, 0]);
var ordinalColorScale = d3.scale.category20();
var xAxis = d3.svg.axis()
			.scale(x)
			.orient("bottom");
var yAxis = d3.svg.axis()
			.scale(y)
			.orient("left");
var yGridlines = d3.svg.axis()
				.scale(y)
				.tickSize(-width,0,0)
				.tickFormat("")
				.orient("left");
var svg = d3.select("#chartArea").append("svg")
			.attr("id", "chart")
			.attr("width", w)
			.attr("height", h);
var chart = svg.append("g")
			.classed("display", true)
			.attr("transform", "translate(" + margin.left + "," + margin.top + ")");
function plot(params){
	this.append("g")
		.call(yGridlines)
		.classed("gridline", true)
		.attr("transform", "translate(0,0)")
	this.selectAll(".bar")
		.data(params.data)
		.enter()
			.append("rect")
			.classed("bar", true)
			.attr("x", function(d,i){
				return x(d.date);
			})
			.attr("y", function(d,i){
				return y(d.issues);
			})
			.attr("height", function(d,i){
				return height - y(d.issues);
			})
			.attr("width", function(d){
				return x.rangeBand();
			})
			.style("fill", function(d,i){
				return ordinalColorScale(i);
			});
	this.selectAll(".bar-label")
		.data(params.data)
		.enter()
			.append("text")
			.classed("bar-label", true)
			.attr("x", function(d,i){
				return x(d.date) + (x.rangeBand()/2)
			})
			.attr("dx", 0)
			.attr("y", function(d,i){
				return y(d.issues);
			})
			.attr("dy", -6)
			.text(function(d){
				return d.issues;
			})
	this.append("g")
		.classed("x axis", true)
		.attr("transform", "translate(" + 0 + "," + height + ")")
		.call(xAxis)
			.selectAll("text")
				.style("text-anchor", "end")
				.attr("dx", -8)
				.attr("dy", 8)
				.attr("transform", "translate(0,0) rotate(-45)");

	this.append("g")
		.classed("y axis", true)
		.attr("transform", "translate(0,0)")
		.call(yAxis);

	this.select(".y.axis")
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.style("text-anchor", "middle")
		.attr("transform", "translate(-50," + height/2 + ") rotate(-90)")
		.text("No. of Issues");

	this.select(".x.axis")
		.append("text")
		.attr("x", 0)
		.attr("y", 0)
		.style("text-anchor", "middle")
		.attr("transform", "translate(" + width/2 + ",80)")
		.text("Last 30 Days");
}
plot.call(chart, {data: data});






























//var w = 400, h = 300;
//
//var svg = d3.select('#chartArea').append('svg')
//.attr('width', w)
//.attr('height', h);
//
//var xScale = d3.scale.ordinal()
//	.domain(dataset)
//	.rangeBands([0, w], 0.1, 0.3);
//
//var yScale = d3.scale.linear()
//	.domain([0, d3.max(dataset) * 1.1])
//	.range([0, h]);
//
//var multiplier = 8;
//
//svg.selectAll('rect')
//	.data(dataset)
//	.enter()
//	.append('rect')
//	.attr('class', 'bar')
//	.attr('x', function (d, i) {
//	  return xScale(d);
//	})
//	.attr('y', function (d) {
//	  return h - yScale(d); 
//	})
//	.attr('width', xScale.rangeBand())
//	.attr('height', function (d) {
//	  return yScale(d);
//});
}
