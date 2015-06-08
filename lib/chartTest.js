var d3 = require('d3');


var test = function(params){
var pad     = { t: 10, r: 10, b: 50, l: 40 }
      // width   = 800 - pad.l - pad.r,
      // height  = 500 - pad.t - pad.b,
      // samples = d3.range(10).map(d3.random.normal(10, 5)),
      // x       = d3.scale.linear().domain([0, samples.length - 1]).range([0, width]),
      // y       = d3.scale.linear().domain([0, d3.max(samples)]).range([height, 0]),
      // xAxis   = d3.svg.axis().scale(x).orient('bottom').tickSize(height),
      // yAxis   = d3.svg.axis().scale(y).orient('left')

  // var line = d3.svg.line()
  //   .interpolate('basis')
  //   .x(function(d, i) { return x(i) })
  //   .y(y)

  // var vis = d3.select('body').append('div')
  // 							 .attr('id','bibi')
  // 							 .attr('class','bobob')
  // 							 .attr('height',400)
  // 							 .attr('width', 400)
  // 							 .html('<h1>width</h1>')
    


  vis = d3.select('body').append('div')
    .attr('id', params.containerId).html('<h1>width</h1>');
    

  // var selector = '#' + params.containerId;
  // var svg = d3.select(selector).node().html('<h1>width</h1>');
  // d3.select(selector).remove();

  // return vis;


  // console.log(vis)
    
return vis
};


module.exports = {
	test:test
};
