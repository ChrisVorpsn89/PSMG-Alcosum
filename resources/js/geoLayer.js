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
        map.getView().setZoom(map.getView().getZoom()+2);}
    else{
        map.getView().setCenter(evt.coordinate);
    }
});

map.on('pointermove', function(evt) {
    var pixel = evt.pixel;
    var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
        console.log("feature",feature);
        if(feature.O[" Beer"] === undefined) {
            feature.set(" Beer", "N.A.");
            feature.set(" Wine", "N.A.");
            feature.set(" Spirits", "N.A.");
            feature.set(" All types", "N.A.");

        }
        return feature;

    });


    var rect = $('.beer .name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
//var size = $(this).data('size');
    var size = (feature.O[" Beer"])/6;
    if (feature.O[" Beer"] == "N.A."){
        size = 0;
    }
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);

    $('.beer .name .consume').text(feature.O[" Beer"] + " L");


    var rect = $('.wine .name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
    var size = (feature.O[" Wine"])/6;
    if (feature.O[" Wine"] == "N.A."){
        size = 0;
    }
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);


    console.log("geiz",$('.drink wine, #consume wine').text);
    $('.wine .name .consume').text(feature.O[" Wine"] + " L");



    var rect = $('.whisky .name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
    var size = (feature.O[" Spirits"])/6;
    if (feature.O[" Spirits"] == "N.A."){
        size = 0;
    }
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);

    $('.whisky .name .consume').text(feature.O[" Spirits"] + " L");


    var rect = $('.alcopop .name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
    var size = (feature.O[" All types"])/20;
    if (feature.O[" All types"] == "N.A."){
        size = 0;
    }
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);

    $('.alcopop .name .consume').text(feature.O[" All types"] + " L");



    $('.country p').text(feature.O.name);

    //$(".flag").attr("src","https://lipis.github.io/flag-icon-css/flags/4x3/"+ feature.a.substring(0, 2).toLowerCase()  +".svg");
    $(".flag").attr("src","https://lipis.github.io/flag-icon-css/flags/4x3/"+ inverseCountryCodes[feature.O.name.toString()].toLowerCase() +".svg");



});

//graphline 

var svg = d3.select("svg"),
    margin = {top: 20, right: 20, bottom: 30, left: 50},
    width = +svg.attr("width") - margin.left - margin.right,
    height = +svg.attr("height") - margin.top - margin.bottom,
    g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");

var parseTime = d3.timeParse("%d-%b-%y");

var x = d3.scaleTime()
    .range([0, width]);

var y = d3.scaleLinear()
    .range([height, 0]);

var line = d3.line()
    .x(function(d) { console.log(d.year); return x(d.year); })
    .y(function(d) { console.log(d.consume); return y(d.consume); });

d3.json("data/converted_1979_1966.json", function(error,data) {
    
     data.forEach(function(d){
         
        if(d.Country == "Albania" && d.BeverageTypes == " Beer"){
            for(int i = 1960; i<1969; i++){
                d.year = d.Year    
            }
            
        
         console.log(d);
        }
     });

  x.domain(d3.extent(data, function(d) { console.log(d.year); return d.year; }));
  y.domain(d3.extent(data, function(d) { return d.consume; }));

  g.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .select(".domain")
       

  g.append("g")
      .call(d3.axisLeft(y))
    .append("text")
      .attr("fill", "#0000")
      .attr("transform", "rotate(-90)")
      .attr("y", 6)
      .attr("dy", "0.71em")
      .attr("text-anchor", "end")
      .text("Consum in l ");

  g.append("path")
      .data(data)
      .attr("fill", "none")
      .attr("stroke", "steelblue")
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .filter
      .attr("stroke-width", 1.5)
      .attr("d", line);

});

   
    
 

 



                 
         

  
    
    
