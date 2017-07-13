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
  xhReq.send(null);
  reportOne = JSON.parse(xhReq.responseText);
};

/*
for(var i = 0; i < jsonObject.features.length; i++){
  //console.log(jsonObject.features[i].geometry.coordinates[0][0]);
    if(jsonObject.features[i].geometry.coordinates[0][0].length == 2){
  var city = new ol.Feature({
      //feature name added
      name: jsonObject.features[i].properties.name
      //geometry: new ol.geom.Point(ol.proj.fromLonLat(jsonObject.features[i].geometry.coordinates[0][0]))
  });

  city.setStyle(new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions}  ({
          color: '#8959A8',
          scale: 1.7,
          crossOrigin: 'anonymous',
          src: 'https://openlayers.org/en/v4.1.1/examples/data/dot.png'
      }))
  }));
    cityArray.push(city);}
}
*/

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
  findHighestValue();
  countrySource.refresh({force:true});
});

function getYear(sliderValue){
  getJsonData(sliderValue);
  timeLine = String(sliderValue);
  findHighestValue();
  countrySource.refresh({force:true});
};

var countryhighestvalue;
var highestValue = 0;
var averageConsume;
var countCountry;
var countConsume;

function findHighestValue(){
    countCountry = 0;
    countConsume = 0;
    highestValue = 0;
    count = 0;
    var reportYear = "Year" + timeLine;
    for( var j = 0; j < jsonObject.features.length;j++){
      for(var k = 0; k < reportOne.length; k++){
        if(reportOne[k].Country == jsonObject.features[j].properties.name){
          if(reportOne[k].BeverageTypes == selectedType){
            var value = parseFloat(reportOne[k][reportYear]);
            if(value >= 0){
            countConsume += value;
            countCountry += 1;
            };

              if(value > highestValue){
                highestValue = value;
                countryhighestvalue =  reportOne[k].Country;
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

  for(var k = 0; k < reportOne.length; k++){
    if(reportOne[k].Country == tempFeature.O.name){
      if(reportOne[k].BeverageTypes == selectedType){
        var value = parseFloat(reportOne[k][reportYear]);
          if(value > highestValue){
            highestValue = value;
            countryhighestvalue =  reportOne[k].Country;
          };
        };

      if(reportOne[k].BeverageTypes == " Beer"){
        //Beer added
        tempFeature.set(" Beer", reportOne[k][reportYear]);
        };

        if(reportOne[k].BeverageTypes == " Wine"){
        //Wine added
        tempFeature.set(" Wine", reportOne[k][reportYear]);
        };

        if(reportOne[k].BeverageTypes == " Spirits"){
        //Spirits added
        tempFeature.set(" Spirits", reportOne[k][reportYear]);
        };

        if(reportOne[k].BeverageTypes == " All types"){
        //Total added
        tempFeature.set(" All types", reportOne[k][reportYear]);
        };
    };
  };
};

function styleFunction(tempFeature, resolution){
setUpValues(tempFeature,resolution);
//Color Function
    var value = parseFloat(tempFeature.O[selectedType]);
    var scalelevel = 8;
    var summand = highestValue/8;
    var color;
    var stroke = defaultStyle.stroke;

    // switch bedingung??
    if(!value){
        color = '#bbb';
    }
    if (value < summand ){
        color = '#FFFFF0';
    }
    if (value == 0 ){
        color = '#90EE90';
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
  center: ol.proj.transform([-25, 33.82], 'EPSG:4326', 'EPSG:3857'),
  zoom: 3,
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

function displayTooltip(evt) {
    var pixel = evt.pixel;
    var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
        //console.log("feature",feature.O.name);
        return feature;
    });

    tooltip.style.display = feature ? '' : 'none';
    if (feature) {
        overlay.setPosition(evt.coordinate);
        tooltip.innerHTML = "<h4>"+feature.O.name+"</h4><table>"+
            "<tr><td>Beer: </td><td>"+ feature.O[" Beer"] +"</td>Litres per Person</tr>"+
            "<tr><td>Wine: </td><td>"+ feature.O[" Wine"] +"</td></tr>"+
            "<tr><td>Spirits: </td><td>"+ feature.O[" Spirits"] +"</td></tr>"+
            "<tr><td>Total: </td><td>"+ feature.O[" All types"] +"</td></tr>"+
            "</table>";
    };
};

map.on('pointermove', displayTooltip);

map.on('click', function(evt) {
    if(map.getView().getZoom()<=3){
        map.getView().setCenter(evt.coordinate);
        map.getView().setZoom(map.getView().getZoom()+2);}
    else{
        map.getView().setCenter(evt.coordinate);
    }
});

map.on('pointermove', function(evt) {
    var pixel = evt.pixel;
    var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
        //console.log("feature",feature.O.name);
        return feature;

    });
    var rect = $('.name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
//var size = $(this).data('size');
    var size = (feature.O[" Beer"])/6;
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);


});

//graphline 
d3.csv("data/average.csv",function(error,data){
    data.forEach(function(d){
        console.log(d);
                 
                 });
var h = 300;
var margin_x = 32;
var margin_y = 20;
    var svg = d3.select("body")
    .append("svg:svg")
    .attr("width", w)
    .attr("height", h);
    var labels = svg.append("g")
       .attr("class","labels")
 
    labels.append("text")
       .attr("transform", "translate(0," + h + ")")
       .attr("x", (w-margin_x))
       .attr("dx", "-1.0em")
       .attr("dy", "2.0em")
       .text("[Months]");
    labels.append("text")
       .attr("transform", "rotate(-90)")
       .attr("y", -40)
       .attr("dy", ".71em")
       .style("text-anchor", "end")
       .text("Attendees");
    
    var title = svg.append("g")
       .attr("class","title");
 
    title.append("text")
       .attr("x", (w / 2))
       .attr("y", -30 )
       .attr("text-anchor", "middle")
       .style("font-size", "22px")
       .text("A D3 line chart from CSV file");
     svg.append("path")
       .datum(data)
       .attr("class", "line")
       .attr("d", line);
    var w = 400;

  
var g = svg.append("svg:g")
    .attr("transform", "translate(0," + h + ")");
 
var line = d3.svg.line()
    .x(function(d,i) { console.log(i); })
    .y(function(d) { return console.log(d); });
 
// draw the y axis
g.append("svg:line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", w)
    .attr("y2", 0);
  
// draw the x axis
g.append("svg:line")
    .attr("x1", 0)
    .attr("y1", 0)
    .attr("x2", 0)
    .attr("y2", -d3.max(data)-10);
 

 

});

