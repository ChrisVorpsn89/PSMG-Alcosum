var xhReq = new XMLHttpRequest();
xhReq.open("GET", "data/countries.geo.json", false);
xhReq.send(null);
var jsonObject = JSON.parse(xhReq.responseText);
var timeLine = "",
selectedType = " All types",
url,
selectedBeverage = document.getElementById("selectedBeverage"),
averageConsumeVal = document.getElementById("averageConsumeVal"),
countryNumber = document.getElementById("countryNumber"),
styleCache =  {},
reportOne,reportTwo,reportThree,currentReport;
getJsonData();
currentReport = reportOne;


/**
highestBeverageValue,
reportOne;

function getJsonData(sliderValue){
  if(sliderValue > 1999){
    url = "data/converted_2000_2016.json";
    } else if(sliderValue > 1979){
    url ="data/converted_1999_1980.json";
  } else if(sliderValue > 1965){
    url ="data/converted_1979_1966.json";
  };
  xhReq.open("GET", url, false);

**/

function getJsonData(){

url1 = "data/converted_2000_2016.json";
url2 ="data/converted_1999_1980.json";
url3 ="data/converted_1979_1966.json";
console.log("HUUUUURE");
  xhReq.open("GET", url1, false);
  xhReq.send(null);
  reportOne = JSON.parse(xhReq.responseText);
  xhReq.open("GET", url2, false);
  xhReq.send(null);
  reportTwo = JSON.parse(xhReq.responseText);
  xhReq.open("GET", url3, false);
  xhReq.send(null);
  reportThree = JSON.parse(xhReq.responseText);


};


//Parsing the JSON with centroids of all countries
var centroidJSON;
function getCentroidsJSON (){
    url = "data/centroids.json";
    xhReq.open("GET", url, false);
    xhReq.send(null);
    centroidJSON = JSON.parse(xhReq.responseText);
}
getCentroidsJSON();

var highestOverallValueAlltypes = 0;
var highestOverallValueBeer = 0;
var highestOverallValueSpirits = 0;
var highestOverallValueWine = 0;




var countrySource = new ol.source.Vector({
    projection : 'EPSG:3857',
    url: 'data/countries.geo.json',
    format: new ol.format.GeoJSON()
});


var defaultStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: [250,0,250,1]
  }),
  stroke: new ol.style.Stroke({
    color: [220,220,220,1],
    width: 1
  })
});

selectedBeverage.addEventListener("change", function(){
  selectedType = selectedBeverage.options[selectedBeverage.selectedIndex].value;
  legendData(selectedType);
  findHighestValue();
  countrySource.refresh({force:true});
});
var specificCountryJson;
function getYear(sliderValue){
  if(sliderValue > 1999 ){
      currentReport = reportOne;
  } else if(sliderValue <= 1999 && sliderValue > 1979) {
      currentReport = reportTwo;

  } else if (sliderValue <= 1979){
      currentReport = reportThree;
  }


  timeLine = String(sliderValue);
  findHighestValue();

  countrySource.refresh({force:true});
};

var highestCountryCoordinateLon;
var highestCountryCoordinateLat;
var countryhighestvalue;
var highestValue = 0;
var averageConsume;
var countCountry;
var countConsume;

function findHighestValue(slidervalue, currentreport){
    countCountry = 0;
    countConsume = 0;
    highestValue = 0;
    count = 0;
    var reportYear = "Year" + timeLine;
    for( var j = 0; j < jsonObject.features.length;j++){
      for(var k = 0; k < currentReport.length; k++){
        if(currentReport[k].Country == jsonObject.features[j].properties.name){
          if(currentReport[k].BeverageTypes == selectedType){
            var value = parseFloat(currentReport[k][reportYear]);
            if(value >= 0){
            countConsume += value;
            countCountry += 1;
            };

              if(value > highestValue){
                highestValue = value;
                countryhighestvalue =  currentReport[k].Country;
              };
            };
        };
      };
    };

    averageConsume = countConsume/countCountry;
    countryNumber.innerHTML = countCountry.toString();
    averageConsumeVal.innerHTML = averageConsume.toFixed(2);
};

function setUpValues(tempFeature, resolution){
var reportYear = "Year" + timeLine;

  for(var k = 0; k < currentReport.length; k++){
    if(currentReport[k].Country == tempFeature.O.name){
      if(currentReport[k].BeverageTypes == selectedType){
        var value = parseFloat(currentReport[k][reportYear]);
          if(value > highestValue){
            highestValue = value;
            countryhighestvalue =  currentReport[k].Country;

          };
        };

      if(currentReport[k].BeverageTypes == " Beer"){
        //Beer added
        tempFeature.set(" Beer", currentReport[k][reportYear]);
        };

        if(currentReport[k].BeverageTypes == " Wine"){
        //Wine added
        tempFeature.set(" Wine", currentReport[k][reportYear]);
        };

        if(currentReport[k].BeverageTypes == " Spirits"){
        //Spirits added
        tempFeature.set(" Spirits", currentReport[k][reportYear]);
        };

        if(currentReport[k].BeverageTypes == " All types"){
        //Total added
        tempFeature.set(" All types", currentReport[k][reportYear]);
        };
    };
  };
};

function legendData(type){
  type = selectedType;
  if(selectedType == " All types"){
    highestBeverageValue = 26;
  };
  if(selectedType == " Beer"){
    highestBeverageValue = 10;
  };
  if(selectedType == " Wine"){
    highestBeverageValue = 20;
  };
  if(selectedType == " Spirits"){
    highestBeverageValue = 14;
  };

  var summand = highestBeverageValue/8;
  document.getElementById("legend-box-b").innerHTML = "0 - " + parseInt(summand);
  document.getElementById("legend-box-c").innerHTML = parseInt(summand) + " - " + parseInt(2*summand);
  document.getElementById("legend-box-d").innerHTML = parseInt(2*summand) + " - " + parseInt(3*summand);
  document.getElementById("legend-box-e").innerHTML = parseInt(3*summand) + " - " + parseInt(4*summand);
  document.getElementById("legend-box-f").innerHTML = parseInt(4*summand) + " - " + parseInt(5*summand);
  document.getElementById("legend-box-g").innerHTML = parseInt(5*summand) + " - " + parseInt(6*summand);
  document.getElementById("legend-box-h").innerHTML = parseInt(6*summand) + " - " + parseInt(7*summand);
  document.getElementById("legend-box-i").innerHTML = parseInt(7*summand) + " - " + parseInt(8*summand);
  return highestBeverageValue;
}

function styleFunction(tempFeature, resolution){
setUpValues(tempFeature,resolution);
//Color Function
    var value = parseFloat(tempFeature.O[selectedType]);
    var scalelevel = 8;
    legendData();
    var summand = highestBeverageValue/8;
    var color;
    var stroke = defaultStyle.stroke;

    // switch bedingung??
    if(!value){
        color = '#bbb';
    }
    if (value == 0 ){
        color = '#90EE90';
    }
    if (value < summand ){
        color = '#FFFFF0';
    }
    if (value > summand &&  value < 2*summand){
        color = '#fee0d2';
    }
    if (value > 2*summand && value < 3*summand){
        color = '#fcbba1';
    }
    if (value > 3*summand && value < 4*summand){
        color = '#fc9272';
    }
    if (value > 4*summand && value < 5*summand){
        color = '#fb6a4a';
    }
     if (value > 5*summand && value < 6*summand){
        color = '#ef3b2c';
    }
     if (value > 6*summand && value < 7*summand){
        color = '#cb181d';
    }
     if (value > 7*summand){
        color = '#99000d'
    }
    if(value == highestValue){
        //color = '#ffa500';
        stroke =1000;


        //14.07 Icon testing

        //highestCountryCoordinateLon = tempFeature.O.geometry.B[0];
       // highestCountryCoordinateLat = tempFeature.O.geometry.B[1];
       // console.log(highestCountryCoordinateLon/100000,highestCountryCoordinateLat/100000);

        var highestValueCountryName = tempFeature.O.name;
        var long = centroidJSON[highestValueCountryName].LONG;
        var lat = centroidJSON[highestValueCountryName].LAT;

        highestValueIcon.getGeometry().setCoordinates(ol.proj.fromLonLat([long,lat]));
        highestValueIcon.set("name", tempFeature.O.name);
        highestValueIcon.set(" Beer", tempFeature.O[" Beer"]);
        highestValueIcon.set(" Wine", tempFeature.O[" Wine"]);
        highestValueIcon.set(" Spirits", tempFeature.O[" Spirits"]);
        highestValueIcon.set(" All types", tempFeature.O[" All types"]);



     }
        style = new ol.style.Style({
          fill: new ol.style.Fill({
            color: color
          }),
          stroke: stroke
        });
    return style;
};



var countryLayer = new ol.layer.Vector({
  source: countrySource,
    style: styleFunction
});

//Layer for capital names, etc.
var terrainLabelLayer = new ol.layer.Tile({
    source: new ol.source.Stamen({
        layer: 'terrain-labels'
    })
});



var center = ol.proj.transform([0, 0], 'EPSG:4326', 'EPSG:3857');
var view = new ol.View ({
  center: ol.proj.transform([0, 33.82], 'EPSG:4326', 'EPSG:3857'),
  zoom: 2,
});


var map = new ol.Map({
 target: 'map',
    //Layers added to Array
  layers: [countryLayer,terrainLabelLayer],
  view: view
});

var tooltip = document.getElementById('tooltip');
var overlay = new ol.Overlay({
    element: tooltip,
    offset: [10, 0],
    positioning: 'bottom-left'
});

//map.addOverlay(overlay);

overlay.setMap(map);

//Icon testing 20.07
var vectorSource;
var vectorLayer;

var highestValueIcon = new ol.Feature({
    // geometry: new ol.geom.Point(ol.proj.fromLonLat(tempFeature.O.geometry.f)),
    //geometry: new ol.geom.Point(ol.proj.fromLonLat([highestCountryCoordinateLon/100000,highestCountryCoordinateLat/100000]))
    geometry: new ol.geom.Point(ol.proj.fromLonLat([0,0]))
});

highestValueIcon.setStyle(new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        scale: 0.2,
        crossOrigin: 'anonymous',
        src: 'resources/img/if_advantage_quality_1034364.png'
    }))
}));


vectorSource = new ol.source.Vector({
    features: [highestValueIcon]
});

vectorSource.clear();

vectorSource = new ol.source.Vector({
    features: [highestValueIcon]
});

vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

map.removeLayer(vectorLayer);
map.addLayer(vectorLayer);

function displayTooltip(evt) {
    var pixel = evt.pixel;
    var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
        //console.log("feature",feature.O.name);
        return feature;
    });

    tooltip.style.display = feature ? '' : 'none';
    if (feature) {
        overlay.setPosition(evt.coordinate);
        tooltip.innerHTML = "<h4>"+feature.O.name+"</h4>"
            /*+ "<table>"+
            "<tr><td>Beer: </td><td>"+ feature.O[" Beer"] +"</td>Litres per Person</tr>"+
            "<tr><td>Wine: </td><td>"+ feature.O[" Wine"] +"</td></tr>"+
            "<tr><td>Spirits: </td><td>"+ feature.O[" Spirits"] +"</td></tr>"+
            "<tr><td>Total: </td><td>"+ feature.O[" All types"] +"</td></tr>"+
            "</table>";*/
    };
};

map.on('pointermove', displayTooltip);

map.on('click', function(evt) {
    if(map.getView().getZoom()<=3){
        map.getView().setCenter(evt.coordinate);
        map.getView().setZoom(map.getView().getZoom()+2);

}else{
        map.getView().setCenter(evt.coordinate);
    }
});

map.on('pointermove', function(evt) {
    var pixel = evt.pixel;
    var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
        //console.log("feature",feature);
        if(feature.O[" Beer"] === undefined) {
            feature.set(" Beer", "N.A.");
            feature.set(" Wine", "N.A.");
            feature.set(" Spirits", "N.A.");
            feature.set(" All types", "N.A.");

        }
        return feature;

    });

if(feature!== undefined) {
    var rect = $('.beer .name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
//var size = $(this).data('size');
    var size = (feature.O[" Beer"]) / 6;
    if (feature.O[" Beer"] == "N.A.") {
        size = 0;
    }
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);

    $('.beer .name .consume').text(feature.O[" Beer"] + " L");


    var rect = $('.wine .name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
    var size = (feature.O[" Wine"]) / 6;
    if (feature.O[" Wine"] == "N.A.") {
        size = 0;
    }
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);


    $('.wine .name .consume').text(feature.O[" Wine"] + " L");


    var rect = $('.whisky .name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
    var size = (feature.O[" Spirits"]) / 6;
    if (feature.O[" Spirits"] == "N.A.") {
        size = 0;
    }
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);

    $('.whisky .name .consume').text(feature.O[" Spirits"] + " L");


    var rect = $('.alcopop .name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
    var size = (feature.O[" All types"]) / 20;
    if (feature.O[" All types"] == "N.A.") {
        size = 0;
    }
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);

    $('.alcopop .name .consume').text(feature.O[" All types"] + " L");


    $('.country p').text(feature.O.name);

    //$(".flag").attr("src","https://lipis.github.io/flag-icon-css/flags/4x3/"+ feature.a.substring(0, 2).toLowerCase()  +".svg");
    if(feature.O.name!==undefined) {
        $(".flag").attr("src", "https://lipis.github.io/flag-icon-css/flags/4x3/" + inverseCountryCodes[feature.O.name.toString()].toLowerCase() + ".svg");
    }
    else{
console.log(feature);
    }
}

});


// parseJSON in the right format
var data = [];

function manipulateJson(report, feature){
    specificCountryJson = report.filter(function(el){
        return  el.Country == feature.O.name && el.BeverageTypes == selectedType;
        });

    for (var i = 0; i< specificCountryJson.length; i++){
        var obj = specificCountryJson[i];
        for (var key in obj) {
            if (obj.hasOwnProperty(key)) {
            console.log(key + " -> " + obj[key]);
            if(obj[key] == "null"){
                obj[key] = 0.0;
             console.log(key + " -> " + obj[key]);
            }

            }
        var temp = new Object();
            if(key !== "Country" && key !== "BeverageTypes"){

            temp["year"]= parseFloat(key.slice(4,8).toString());
            temp["consume"]= parseFloat(obj[key]);
            data.push(temp);
            }




        }
    }

    console.log(data);
    console.log(d3.max(data, function(d) { return d.consume;} ));
}
function drawBarChart(feature){
var margin = {top: 40, right: 20, bottom: 30, left: 40},
    width = 800 - margin.left - margin.right,
    height = 480 - margin.top - margin.bottom;

var formatPercent = d3.format(".0%");

var x = d3.scale.ordinal().domain(data.map(function(d) { return d.year; })).rangeRoundBands([0, width], .03);

var y = d3.scale.linear().domain([0, d3.max(data, function(d) { return d.consume; })])
    .range([height, 0]);

var xAxis = d3.svg.axis()
    .scale(x)
    .tickValues(x.domain().filter(function(d, i) { console.log("HURRE" + data.length);if(data.length > 20 ){ console.log(i%5); return !(i%5); } else { return i;} }))
    .orient("bottom");

var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")



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
        .style("font-size", "16px")
        .text("Back to Map");
  document.getElementById("exitText").addEventListener('click', function(event){
      d3.selectAll(".graph > *").remove();
//zoom reset
      map.getView().setZoom(2.4);

  });

  svg.append("g")
      .attr("class", "y axis")
      .call(yAxis)
       .append("text")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", ".71em")

  svg.selectAll(".bar")
      .data(data)
    .enter().append("rect")
      .attr("class", "bar")
      .attr("x", function(d) { return x(d.year); })
      .attr("width", x.rangeBand())
      .attr("y", function(d) { return y(d.consume); })
      .attr("height", function(d) { return height - y(d.consume); })
      .on('mouseover', tip.show)
      .on('mouseout', tip.hide)

function type(d) {
  d.consume = +d.consume;

  return d;
}
}


map.on('click', function(evt) {
    var pixel = evt.pixel;

    var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
        //console.log("feature",feature);
    data = [];
    manipulateJson(reportOne, feature);
    manipulateJson(reportTwo,feature);
    manipulateJson(reportThree,feature);


    data.reverse();
    drawBarChart(feature);


    console.log(data);

        if(feature !== undefined) {
          return feature;
        }

    });
    if(feature!== undefined) {
    console.log(feature.O.name);}
});


map.on('click', function(evt) {
    if(map.getView().getZoom()<=3){
        map.getView().setCenter(evt.coordinate);
        map.getView().setZoom(map.getView().getZoom()+2);

    }else{
        map.getView().setCenter(evt.coordinate);
    }
});
