//'use strict';
function getBuildStyle(w, h, top, bottom, left, right, padding, isIssue) {
    return {
        w: w,
        h: h,
        top: top,
        bottom: bottom,
        left: left,
        right: right,
        padding: padding,
        dataType: isIssue ? "issues" : "pulls",

    };
};

function getChartHeight(buildObject) {
    return buildObject.h - buildObject.left - buildObject.bottom;
}

function getChartWidth(buildObject) {
    return buildObject.w - buildObject.top - buildObject.right;
}
var setCharts = function(data, flagData, isIssue, isContent, chartColour, endChartColour) {
    var buildStyle = getBuildStyle(900, 300, 48, 72, 60, 40, 20, flagData,  isIssue);
    var issueflagsIndexs = null;
    for(var t in data) {
        flagData = typeof flagData === "undefined" ? null : flagData;
        var limit, everyIncrease;
        if(flagData !== null ) {
            if(isContent) {
                if(flagData.highlight_content_team_issues_chart === "true") {
                    limit = flagData.issues_content_team_boundary;
                    everyIncrease = false;
                    everyIncrease = flagData.show_content_team_every_increase === "true" ? true : false;
                    issueflagsIndexs = checkIncrease(data[t], limit, everyIncrease, "issues"); //check for issues increases

                }
            } else {
                if(flagData.highlight_team_issues_chart === "true") {
                    limit = flagData.issues_team_boundary;
                    everyIncrease = false;
                    everyIncrease = flagData.show_team_every_increase === "true" ? true : false;
                    issueflagsIndexs = checkIncrease(data[t], limit, everyIncrease, "issues"); //check for issues increases
                }
            }

        }
        setTeamBarChart(data[t], isIssue, buildStyle, t, issueflagsIndexs, isContent, chartColour, endChartColour)
    }
};

var setTeamBarChart = function(data, isIssue, buildStyle, i, issueflagsIndexs, isContent, chartColour, endChartColour) {
    var width = getChartWidth(buildStyle);
    var height = getChartHeight(buildStyle);
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
        .range([chartColour, endChartColour]);
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
            //.style('cursor', 'pointer')
            .style('fill', function(d, i) {
                // this section of code is responsible for highlighting any increases if specified
                if (issueflagsIndexs !== null) {
                    return checkForFlagValues(issueflagsIndexs, linearColorScale, i);
                } else {
                    return linearColorScale(i);
                }
    });

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

var setSingleChart = function(issueData, pullsData, index, isIssue, flagData, isContent, chartColour, endChartColour) {
    var flagsIndexs = null;
    var data = isIssue ? issueData[index] : pullsData[index];
    var buildStyle = getBuildStyle(900, 300, 48, 72, 60, 40, 20, isIssue);
    flagData = typeof flagData === "undefined" ? null : flagData;

    if(flagData !== null) {
        var flagTarget, boundaryTarget, target

        if(isContent) {
            flagTarget = isIssue ? "highlight_content_team_issues_chart" : "highlight_content_team_pulls_chart";
            boundaryTarget = isIssue ? "issues_content_team_boundary" : "pulls_content_team_boundary";
            target = isIssue ? "issues" : "pulls";
        } else {
            flagTarget = isIssue ? "highlight_team_issues_chart" : "highlight_team_pulls_chart";
            boundaryTarget = isIssue ? "issues_team_boundary" : "pulls_team_boundary";
            target = isIssue ? "issues" : "pulls";
        }


        if(flagData[flagTarget] === "true") {

            var limit = flagData[boundaryTarget];

            var everyIncrease = false;
            if(isContent) {
                everyIncrease = flagData.show_content_team_every_increase === "true" ? true : false;

            } else {
                everyIncrease = flagData.show_team_every_increase === "true" ? true : false;

            }

            flagsIndexs = checkIncrease(data, limit, everyIncrease, target); //check for issues increases
        }
    }
    $('.team-chart-section' + index).remove();
    var width = getChartWidth(buildStyle);
    var height = getChartHeight(buildStyle);
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
        .range([chartColour, endChartColour]);
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
            //.style('cursor', 'pointer')
            .style('fill', function(d, i) {

                // this section of code is responsible for highlighting any increases if specified
                if (flagsIndexs !== null) {
                    return checkForFlagValues(flagsIndexs, linearColorScale, i);
                } else {
                    return linearColorScale(i);
                }
            });

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

};


var checkIncrease = function(data, boundary, periodic, targetType ) {
    var triggerArray = [];
    if (periodic) { // if all chart days are to be analysed
        for (var i = 1; i < data.length; i++) {
            var df = data[i][targetType] - data[i-1][targetType];
            if (df >= boundary) {
                triggerArray.push(i);  //index of triggered items
            }
        }

    } else {
        var increase = data[data.length - 1][targetType] - data[data.length - 2][targetType];
        if (increase >= boundary) { // if the targeted boundary is the last day and meets requirements
            triggerArray.push(999);
            triggerArray.push(data.length - 1);

        } else { // if the last day does not meet the desired requirements
            triggerArray.push(-999);
            triggerArray.push(-999);
        }
        return triggerArray;
    }

    return triggerArray;
};

var checkForFlagValues = function(flagsIndexs, linearColorScale, i) {
    if (flagsIndexs !== null) { //check if a flag has been set

        if (flagsIndexs[0] === 999) { // check that requirement is not for last value only

            if (i === flagsIndexs[1]) { // check if actual chart bar is the same index as the given value, if so return red
                return 'ff0000'
            }
        } else { // return the colour red with for every increase
            for (var d = 0; d < flagsIndexs.length; d++) {
                if (flagsIndexs[d] === i) {
                    return 'ff0000'
                }
            }
        } // otherwise return the default colour scheme
        return linearColorScale(i);
    }
};
