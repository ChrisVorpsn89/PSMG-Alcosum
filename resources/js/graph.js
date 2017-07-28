var barChartdata = [];
var lines = document.getElementsByClassName('line');

function drawOverAllLineChart(){
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = innerWidth-100  - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var parseTime = d3.timeParse("%Y"),
bisectDate = d3.bisector(function(d) { return d.year; }).left;

var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

var beerline = d3.line()
    .x(function(d) {return x(d.year); })
    .y(function(d) {  return y(d.beer); });
var allline = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.all); });
var wineline = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.wine); });
var spiritline = d3.line()
    .x(function(d) { return x(d.year); })
    .y(function(d) { return y(d.spirits); });

var svg = d3.select(".message").append("svg")
    .attr("width",innerWidth)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "lineChart")
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

d3.csv("data/average.csv", function(error, data) {
  if (error) throw error;

  data.forEach(function(d) {
      d.year = parseTime(String(d.year));
      d.beer = +d.beer;
      d.all = +d.all;
      d.wine = +d.wine;
      d.spirits =+d.spirits;
  });

  x.domain(d3.extent(data, function(d) { return d.year; }));
  y.domain([0, d3.max(data, function(d) {
	  return Math.max(d.all,d.beer,d.wine,d.spirits); })]);
svg.append("text")
        .attr("x", (width/30))
        .attr("y", 0 - (margin.top / 2))
        .attr("id","left")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Liter per Person ");

  svg.append("path")
      .data([data])
      .attr("class", "line")
      .style("stroke","#d95f02")
      .attr("id","beerpath")
      .attr("d",beerline);

  svg.append("path")
      .data( [data])
      .attr("class", "line")
      .style("stroke", "#7570b3")
      .attr("id","winepath")
      .attr("d", wineline);

    svg.append("path")
      .data( [data])
      .attr("class", "line")
      .style("stroke", "#e7298a")
      .attr("id","spiritpath")
      .attr("d", spiritline);
    svg.append("path")
      .data( [data])
      .attr("class", "line")
      .style("stroke", "#1b9e77")
      .attr("id","allpath")
      .attr("d", allline);

    svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(" Average Consume World");

    var legend = svg.selectAll('g')
      .data(["All Types","Wine","Beer","Spirits"])
      .enter()
      .append('g')
      .attr('class', 'legend');

    legend.append('rect')
      .attr('x', width+8)
      .attr('y',function(d,i){ return i*20;})
      .attr('width', 10)
      .attr('height', 10)
     .style("fill",function(d) {
        if(d == "Wine"){
            return "#7570b3";
        }
        if(d=="All Types"){
            return "#1b9e77";
        }
        if(d=="Beer"){
            return "#d95f02";
        }
        if(d=="Spirits"){
            return "#e7298a";
        }
      });

    legend.append('text')
      .attr("text-anchor","left")
      .attr('x',width+60)
      .attr('y', function(d, i) {
        return (i * 20) + 9;
      })
      .text(function(d) {
            return d;
      });

  svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x));

  svg.append("g")
      .call(d3.axisLeft(y))
        .append("text");

function make_x_gridlines() {
    return d3.axisBottom(x);
}

function make_y_gridlines() {
    return d3.axisLeft(y)
        .ticks(5);
}
    svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
      );

  svg.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
      );

var mouseG = svg.append("g")
  .attr("class", "mouse-over-effects");

mouseG.append("path")
  .attr("class", "mouse-line")
  .style("stroke", "black")
  .style("stroke-width", "1px")
  .style("opacity", "0");

var mousePerLine = mouseG.selectAll('.mouse-per-line')
  .data(["Beer","Wine","Spirits","All Types"])
  .enter()
  .append("g")
  .attr("class", "mouse-per-line");

mousePerLine.append("circle")
  .attr("r", 7)
  .style("fill",function(d) {
        if(d == "Wine"){
          return "#7570b3";
        }
      if(d=="All Types"){
          return "#1b9e77";
        }
      if(d=="Beer"){
          return "#d95f02";
        }
      if(d=="Spirits"){
          return "#e7298a";
        }
  })
  .style("stroke-width", "1px")
  .style("opacity", "0");

mousePerLine.append("text")
  .attr("transform", "translate(10,3)")
.style("fill","black");

mouseG.append('svg:rect')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on('mouseout', function() {

    d3.select(".mouse-line")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "0");
  })
  .on('mouseover', function() {

    d3.select(".mouse-line")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "1");
  })
  .on('mousemove', function() {

    var mouse = d3.mouse(this);

    d3.select(".mouse-line")
      .attr("d", function() {
        var d = "M" + mouse[0] + "," + height;
        d += " " + mouse[0] + "," + 0;
        return d;
      });

    d3.selectAll(".mouse-per-line")
      .attr("transform", function(d, i) {
        var xDate = x.invert(mouse[0]);
        var beginning = 0,
            end = lines[i].getTotalLength(),
            target = null;

        while (true){
          target = Math.floor((beginning + end) / 2);
          pos = lines[i].getPointAtLength(target);
          if ((target === end || target === beginning) && pos.x !== mouse[0]) {
              break;
          }
          if (pos.x > mouse[0])      end = target;
          else if (pos.x < mouse[0]) beginning = target;
          else break;
        }

        d3.select(this).select('text')
          .text(y.invert(pos.y).toFixed(2));
        return "translate(" + mouse[0] + "," + pos.y +")";
            });
        });
    });
}
function drawBarChart(feature){
var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scaleBand().rangeRound([0, width]).padding(0.3);
    x.domain(barChartdata.map(function(d) { return d.year }));

var y = d3.scaleLinear().domain([0, d3.max(barChartdata, function(d) { return d.consume; })])
    .range([height, 0]);

var xAxis = d3.axisBottom(x)
    .tickValues(x.domain().filter(function(d, i) {if(barChartdata.length > 20 ){return !(i%5); } else { return i;} }));
var yAxis = d3.axisLeft(y);

var tip = d3.tip()
  .attr('class', 'd3-tip')
  .offset([-10, 0])
  .html(function(d) {
    return "<strong>Consume:</strong> <span style='color:red'>" + d.consume + " l</span> <strong>Year:</strong> <span style='color:red'>" + d.year + "</span>";
  });

var svg = d3.select(".graph").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id","tempSVG")
    .attr("name","tempSVG")
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    svg.call(tip);

 svg.append("text")
        .attr("x", (width/30))
        .attr("y", 0 - (margin.top / 2))
        .attr("id","left")
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text("Liter per Person ");

  svg.append("text")
        .attr("x", (width / 2))
        .attr("y", 0 - (margin.top / 2))
        .attr("text-anchor", "middle")
        .style("font-size", "16px")
        .text(feature.O.name + " Alcoholtype: " + selectedType);

  svg.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis);

svg.append("text")
        .attr("x", (width-30))
        .attr("y", 0 - (margin.top / 2))
        .attr("id","exitText")
        .attr("text-anchor", "middle")
        .style("font-size", "110%")
        .text("Back to Map");
        resetGraph();

function resetGraph(){
      document.getElementById("exitText").addEventListener('click', function(event){
      d3.selectAll(".graph > *").remove();
      map.getView().setZoom(2.4);

       });
}
    svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
       .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em");

  svg.selectAll(".bar")
      .data(barChartdata)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.consume); })
      .attr("height", function(d) { return height - y(d.consume); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide);

function type(d) {
  d.consume = +d.consume;
  return d;
}
}
function manageGraph(feature){
    d3.selectAll(".graph > *").remove();
    barChartdata = [];

    manipulateJson(reportOne, feature);
    manipulateJson(reportTwo,feature);
    manipulateJson(reportThree,feature);

    barChartdata.reverse();

    drawBarChart(feature);
}
drawOverAllLineChart();
