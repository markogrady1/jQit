'use strict';


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
        setTeamBarChart(data[t], isIssue, buildStyle, i)
    }
};

var setTeamBarChart = function(data, isIssue, buildStyle, i) {
    var width = buildStyle.w - buildStyle.left - buildStyle.right;
    var height = buildStyle.h - buildStyle.top - buildStyle.bottom;
    var chartClass = ".team-chart" + i;
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
        .classed('team-chart', true)
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
            //.on('click', tip.show)
            //.on('mouseout', tip.hide)
            //.on('mouseover', function(d, i){
            //    e = $(this).css('fill');
            //    $(this).css('fill', '#3C7BD5');
            //    var el = d3.select(this);
            //    el.transition()
            //        .duration(300)
            //        .attr({
            //            width: x.rangeBand()+5,
            //            height:height - y(d[i]["issues"])+3,
            //            y: y(d[i]["issues"])-3
            //        });
            //    this.parentNode.appendChild(this);
            //})
            //.on('mouseleave', function(d, i){
            //    $('.display-data').remove();
            //    $(this).css('fill', e);
            //    var el = d3.select(this);
            //    el.transition()
            //        .duration(500)
            //        .attr({
            //            height: height - y(d[i]["issues"]),
            //            y: y(d[i]["issues"]),
            //            width:x.rangeBand()-2
            //        });
            //})
            //.style('fill', function(d, i){
            //    // this section of code is responsible for highlighting any increases if specified
            //    if(buildStyle.dataVal === "issues") {
            //
            //        if(buildStyle.flagIssues !== null) {
            //
            //            if(buildStyle.flagIssues[0] === 999) {
            //
            //                if(i === buildStyle.flagIssues[1]) {
            //                    return 'ff0000'
            //                }
            //            } else {
            //                for (var d = 0; d < buildStyle.flagIssues.length; d++) {
            //                    if(buildStyle.flagIssues[d] === i) {
            //                        return 'ff0000'
            //                    }
            //                }
            //            }
            //        }
            //    } else if(buildStyle.dataVal === "pulls"){
            //
            //        if(buildStyle.flagPulls !== null) {
            //
            //            if(buildStyle.flagPulls[0] === 999) {
            //
            //                if(i === buildStyle.flagPulls[1]) {
            //                    return 'ff0000'
            //                }
            //            } else {
            //                for (var d = 0; d < buildStyle.flagPulls.length; d++) {
            //                    if(buildStyle.flagPulls[d] === i) {
            //                        return 'ff0000'
            //                    }
            //                }
            //            }
            //            return linearColorScale(i);
            //        }
            //        return linearColorScale(i);
            //    }
            //
            //    return linearColorScale(i);  //uncomment line for linearScale colours
            //    //return ordinalColorScale(i);//uncomment line for ordinalScale colours
            //})
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
        this.select('.x.axis')
            .append('text')
            .attr('x', 0)
            .attr('y', 0)
            .classed('x-axis-title', true)
            .style('text-anchor', 'middle')
            .attr('transform', 'translate(' + width / 2 + ', 50)')
            .text("Last 30 Days");
    }
    //if (buildStyle.isIssue){
    //    if(!isPreviousMonthOfData){
    //        $('#chartArea2').hide();
    //    }
    //
    //}
}