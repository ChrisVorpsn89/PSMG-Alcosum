var barChartdata = [];
var lines = document.getElementsByClassName('line');

function drawOverAllLineChart(){
  var margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = innerWidth-100  - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

// parse the date / time
var parseTime = d3.timeParse("%Y"),
bisectDate = d3.bisector(function(d) { return d.year; }).left

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the 1st line
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

// append the svg obgect to the body of the page
// appends a 'group' element to 'svg'
// moves the 'group' element to the top left margin
var svg = d3.select(".message").append("svg")
    .attr("width",innerWidth)
    .attr("height", height + margin.top + margin.bottom)
    .attr("id", "lineChart")
    .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

// Get the data
d3.csv("data/average.csv", function(error, data) {
  if (error) throw error;

  // format the data
  data.forEach(function(d) {
      d.year = parseTime(String(d.year));
      d.beer = +d.beer;
      d.all = +d.all;
      d.wine = +d.wine;
      d.spirits =+d.spirits;
  });

  // Scale the range of the data
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

  // Add the Y Axis
  svg.append("g")
      .call(d3.axisLeft(y))
        .append("text");

    // gridlines in x axis function
function make_x_gridlines() {
    return d3.axisBottom(x);
}

// gridlines in y axis function
function make_y_gridlines() {
    return d3.axisLeft(y)
        .ticks(5);
};

 // add the X gridlines
  svg.append("g")
      .attr("class", "grid")
      .attr("transform", "translate(0," + height + ")")
      .call(make_x_gridlines()
          .tickSize(-height)
          .tickFormat("")
      );

  // add the Y gridlines
  svg.append("g")
      .attr("class", "grid")
      .call(make_y_gridlines()
          .tickSize(-width)
          .tickFormat("")
      );

// append a g for all the mouse over nonsense
var mouseG = svg.append("g")
  .attr("class", "mouse-over-effects");

// this is the vertical line
mouseG.append("path")
  .attr("class", "mouse-line")
  .style("stroke", "black")
  .style("stroke-width", "1px")
  .style("opacity", "0");

// here's a g for each circle and text on the line
var mousePerLine = mouseG.selectAll('.mouse-per-line')
  .data(["Beer","Wine","Spirits","All Types"])
  .enter()
  .append("g")
  .attr("class", "mouse-per-line");

// the circle
mousePerLine.append("circle")
  .attr("r", 7)
  .style("fill",function(d) {
        if(d == "Wine"){
          return "#7570b3";
          };
        if(d=="All Types"){
          return "#1b9e77";
          };
        if(d=="Beer"){
          return "#d95f02";
          };
        if(d=="Spirits"){
          return "#e7298a";
          };
  })
  .style("stroke-width", "1px")
  .style("opacity", "0");

// the text
mousePerLine.append("text")
  .attr("transform", "translate(10,3)")
.style("fill","black");

// rect to capture mouse movements
mouseG.append('svg:rect')
  .attr('width', width)
  .attr('height', height)
  .attr('fill', 'none')
  .attr('pointer-events', 'all')
  .on('mouseout', function() {
    // on mouse out hide line, circles and text
    d3.select(".mouse-line")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "0");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "0");
  })
  .on('mouseover', function() {
    // on mouse in show line, circles and text
    d3.select(".mouse-line")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line circle")
      .style("opacity", "1");
    d3.selectAll(".mouse-per-line text")
      .style("opacity", "1");
  })
  .on('mousemove', function() {
    // mouse moving over canvas
    var mouse = d3.mouse(this);

    // move the vertical line
    d3.select(".mouse-line")
      .attr("d", function() {
        var d = "M" + mouse[0] + "," + height;
        d += " " + mouse[0] + "," + 0;
        return d;
      });

    // position the circle and text
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
          else break; //position found
        }

        // update the text with y value
        d3.select(this).select('text')
          .text(y.invert(pos.y).toFixed(2));

        // return position
        return "translate(" + mouse[0] + "," + pos.y +")";
            });
        });
    });
};

function drawBarChart(feature){
var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scaleBand().rangeRound([0, width]).padding(0.3);
    x.domain(barChartdata.map(function(d) { return d.year }))

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
  })

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
      .call(xAxis)

svg.append("text")
        .attr("x", (width-30))
        .attr("y", 0 - (margin.top / 2))
        .attr("id","exitText")
        .attr("text-anchor", "middle")
        .style("font-size", "110%")
        .text("Back to Map");
        resetGraph();

//zoom reset
function resetGraph(){
      document.getElementById("exitText").addEventListener('click', function(event){
      d3.selectAll(".graph > *").remove();
      map.getView().setZoom(2.4);

       });
};

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
       .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")

  svg.selectAll(".bar")
      .data(barChartdata)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("width", x.bandwidth())
      .attr("y", function(d) { return y(d.consume); })
      .attr("height", function(d) { return height - y(d.consume); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

function type(d) {
  d.consume = +d.consume;
  return d;
  };
};

function manageGraph(feature){
    d3.selectAll(".graph > *").remove();
    barChartdata = [];

    manipulateJson(reportOne, feature);
    manipulateJson(reportTwo,feature);
    manipulateJson(reportThree,feature);

    barChartdata.reverse();

    drawBarChart(feature);
};

drawOverAllLineChart();
