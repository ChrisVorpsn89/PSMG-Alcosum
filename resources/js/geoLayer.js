var xhReq = new XMLHttpRequest();
xhReq.open("GET", "data/countries.geo.json", false);
xhReq.send(null);
var jsonObject = JSON.parse(xhReq.responseText);
var timeLine = "",
selectedType = " All types",
url,
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
  findHighestBeer();

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

//Select Beverage Type
var selectedBeverage = document.getElementById("selectedBeverage");
var styleCache =  {};

selectedBeverage.addEventListener("change", function(){
  selectedType = selectedBeverage.options[selectedBeverage.selectedIndex].value;
  console.log(selectedType);
  countrySource.refresh({force:true});
})


function getYear(sliderValue){
  getJsonData(sliderValue);
  timeLine = String(sliderValue);
  countrySource.refresh({force:true});
};

var highestBeer = 0;


var countryCount = 0;
function findHighestBeer(){
    var reportYear = "Year" + timeLine;
    for( var j = 0; j < jsonObject.features.length;j++){
      for(var k = 0; k < reportOne.length; k++){
        if(reportOne[k].Country == jsonObject.features[j].properties.name){
          if(reportOne[k].BeverageTypes == selectedType){

            //Beer added
            countryCount++;
            var beer = parseFloat(reportOne[k][reportYear]);
              if(beer > highestBeer){
                highestBeer = beer;

              }
            };
        };
      };
    }
}

//sdasd
function setUpValues(tempFeature, resolution){
var reportYear = "Year" + timeLine;
  for(var k = 0; k < reportOne.length; k++){
    if(reportOne[k].Country == tempFeature.O.name){
      if(reportOne[k].BeverageTypes == selectedType){

        //Beer added
        tempFeature.set("beer", reportOne[k][reportYear]);
        countryCount++;
        var beer = parseFloat(tempFeature.O.beer);

          if(beer > highestBeer){
            highestBeer = beer;
          }
        };

      if(reportOne[k].BeverageTypes == " Wine"){

        //Wine added
        tempFeature.set("wine", reportOne[k][reportYear]);
        };

        if(reportOne[k].BeverageTypes == " Spirits"){
        //Spirits added
        tempFeature.set("spirit", reportOne[k][reportYear]);
        };

        if(reportOne[k].BeverageTypes == " All types"){
        //Total added
        tempFeature.set("total", reportOne[k][reportYear]);
        };
    };
  };

}
function styleFunction(tempFeature, resolution) {

  setUpValues(tempFeature,resolution);

//Color Function
    var beer = parseFloat(tempFeature.O.beer);
    var scalelevel = 8;
    var summand = highestBeer/8;
    var color;
// switch bedingung??



    if (beer < summand ){
        color = '#fff5f0';
    }
    if (beer == 0 ){
        color = '#737373';
    }
    if (beer > summand &&  beer < 2*summand){
        color = '#fee0d2'
    }

    if (beer > 2*summand && beer < 3*summand){
        color = '#fcbba1';
    }
    if (beer > 3*summand && beer < 4*summand){
        color = '#fc9272'
    }
    if (beer > 4*summand && beer < 5*summand){
        color = '#fb6a4a'
    }
     if (beer > 5*summand && beer < 6*summand){
        color = '#ef3b2c'
    }
     if (beer > 6*summand && beer < 7*summand){
        color = '#cb181d'
    }
     if (beer > 7*summand && beer < 8*summand){
        color = '#99000d'
    }

        style = new ol.style.Style({
          fill: new ol.style.Fill({
            color: color
          }),
          stroke: defaultStyle.stroke
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
            "<tr><td>Beer: </td><td>"+ feature.O.beer +"</td>Litres per Person</tr>"+
            "<tr><td>Wine: </td><td>"+ feature.O.wine +"</td></tr>"+
            "<tr><td>Spirits: </td><td>"+ feature.O.spirit +"</td></tr>"+
            "<tr><td>Total: </td><td>"+ feature.O.total +"</td></tr>"+
            "</table>";
    }
};

map.on('pointermove', displayTooltip);
