//'use strict';

var setCharts = function(data, isIssue) {
    var buildStyle = {
        w: 900,
        h: 300,
        top: 48,
        bottom: 72,
        left: 60,
        right: 40,
        padding: 20,
        dataType: isIssue ? "Issues" : "Pulls"
    };

    for(var t in data) {
        setTeamBarChart(data[t], isIssue, buildStyle, t)
    }
};

var setTeamBarChart = function(data, isIssue, buildStyle, i) {
    var width = buildStyle.w - buildStyle.left - buildStyle.right;
    var height = buildStyle.h - buildStyle.top - buildStyle.bottom;
    var chartClass = ".team-chart"+i;
    var x = d3.scale.ordinal()
        .domain(data.map(function(entry){
            return entry["plainDate"].split("-")[2];
        }))
        .rangeBands([0, width]);
    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d,i){
            return d["issues"] + d["issues"]/2;
        })])
        .range([height, 0]);
    var yGridlines = d3.svg.axis()
        .scale(y)
        .tickSize(-width, 0, 0)
        .tickFormat('')
        .orient('left');
    var linearColorScale = d3.scale.linear()
        .domain([0, 29])
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

    var svg = d3.select(chartClass).append('svg')
        .classed('team-chart-section' + i, true)
        .attr('height', buildStyle.h)
        .attr('width', buildStyle.w);
    //svg.call(tip);
    var chart = svg.append('g')
        .classed('display', true)
        .attr('transform', 'translate(' + buildStyle.left + ',' + buildStyle.right + ')');
    chart.append("text")
        .classed('title', true)
        .attr("x", (width / 2))
        .attr("y", 0 - (buildStyle.top / 2 - 10))
        .attr("text-anchor", "middle")
        .text(data[0]["team"]);

    plot.call(chart, {
        data:data,
        axis: {
            x: xAxis,
            y: yAxis
        },
        gridlines: yGridlines,
        isIssue: isIssue
    });
    function plot(params) {
        var e;
        var classAppend = isIssue ? '' : 's';
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

                return x(d["plainDate"].split("-")[2]);
            })
            .attr('value', function(d, i) {
                return d["plainDate"].split("-")[2];
            })
            .attr('y', function(d, i){
                return y(d["issues"]);
            })
            .attr('width', function(d, i){
                return x.rangeBand()-2;
            })
            .attr('height', function(d, i){
                return height - y(d["issues"]);
            })
            .style('fill', linearColorScale(i))
            .style('cursor', 'pointer');

        this.selectAll('.bar-label')
            .data(params.data)
            .enter()
            .append('text')
            .classed('bar-label', true)
            .attr('x', function(d, i){

                return x(d["plainDate"].split("-")[2]) + (x.rangeBand()/2);
            })
            .attr('y', function(d, i){
                return y(d["issues"]);
            })
            .attr('dx', 0)
            .attr('dy', -6)
            .text(function(d, i){
                return d["issues"];
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
            .text('No. of ' + buildStyle.dataType);
      var d =  this.select('.x.axis')
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .classed('x-axis-title', true)
            .style('text-anchor', 'middle')
            .attr('transform', 'translate(' + width / 2 + ', 50)')
            .text("Last 30 Days");

    }

}

var setSingleChart = function(issueData, pullsData, index, isIssue) {
    var data = isIssue ? issueData[index] : pullsData[index];

    var buildStyle = {
        w: 900,
        h: 300,
        top: 48,
        bottom: 72,
        left: 60,
        right: 40,
        padding: 20,
        dataType: isIssue ? "issues" : "pulls"
    };

    $('.team-chart-section' + index).remove();
    var width = buildStyle.w - buildStyle.left - buildStyle.right;
    var height = buildStyle.h - buildStyle.top - buildStyle.bottom;
    var chartClass = ".team-chart"+index;
    var x = d3.scale.ordinal()
        .domain(data.map(function(entry){
            return entry["plainDate"].split("-")[2];
        }))
        .rangeBands([0, width]);
    var y = d3.scale.linear()
        .domain([0, d3.max(data, function(d,i){
            return d[buildStyle.dataType] + d[buildStyle.dataType]/2;
        })])
        .range([height, 0]);
    var yGridlines = d3.svg.axis()
        .scale(y)
        .tickSize(-width, 0, 0)
        .tickFormat('')
        .orient('left');
    var linearColorScale = d3.scale.linear()
        .domain([0, 29])
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

    var svg = d3.select(chartClass).append('svg')
        .classed('team-chart-section' + index, true)
        .attr('height', buildStyle.h)
        .attr('width', buildStyle.w);
    //svg.call(tip);
    var chart = svg.append('g')
        .classed('display', true)
        .attr('transform', 'translate(' + buildStyle.left + ',' + buildStyle.right + ')');
    chart.append("text")
        .classed('title', true)
        .attr("x", (width / 2))
        .attr("y", 0 - (buildStyle.top / 2 - 10))
        .attr("text-anchor", "middle")
        .text(data[0]["team"]);

    plot.call(chart, {
        data:data,
        axis: {
            x: xAxis,
            y: yAxis
        },
        gridlines: yGridlines,
        isIssue: isIssue
    });
    function plot(params) {
        var e;
        var classAppend = isIssue ? '' : 's';
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

                return x(d["plainDate"].split("-")[2]);
            })
            .attr('value', function(d, i) {
                return d["plainDate"].split("-")[2];
            })
            .attr('y', function(d, i){
                return y(d[buildStyle.dataType]);
            })
            .attr('width', function(d, i){
                return x.rangeBand()-2;
            })
            .attr('height', function(d, i){
                return height - y(d[buildStyle.dataType]);
            })
            .style('fill', linearColorScale(i))
            .style('cursor', 'pointer');

        this.selectAll('.bar-label')
            .data(params.data)
            .enter()
            .append('text')
            .classed('bar-label', true)
            .attr('x', function(d, i){

                return x(d["plainDate"].split("-")[2]) + (x.rangeBand()/2);
            })
            .attr('y', function(d, i){
                return y(d[buildStyle.dataType]);
            })
            .attr('dx', 0)
            .attr('dy', -6)
            .text(function(d, i){
                return d[buildStyle.dataType];
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
            .text('No. of ' + buildStyle.dataType);
        var d =  this.select('.x.axis')
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .classed('x-axis-title', true)
            .style('text-anchor', 'middle')
            .attr('transform', 'translate(' + width / 2 + ', 50)')
            .text("Last 30 Days");

    }

}