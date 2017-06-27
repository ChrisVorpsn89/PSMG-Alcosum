var xhReq = new XMLHttpRequest();
xhReq.open("GET", "data/countries.geo.json", false);
xhReq.send(null);
var jsonObject = JSON.parse(xhReq.responseText);

xhReq.open("GET", "data/converted_2000_2016.json", false);
xhReq.send(null);
var reportOne = JSON.parse(xhReq.responseText);

/** Gibt Statistik zum Bier aus dem Jahr 2006 aus für jedes Land
for(var j = 0; j < reportOne.length; j++){
  if(reportOne[j].BeverageTypes == " Beer"){
  var timeLine = "2006"
  var reportYear = "Year" + timeLine;

  console.log(reportOne[j].Country);
  console.log(reportOne[j].BeverageTypes);
  console.log(reportOne[j][reportYear]);
  };
}**/

//Gibt alle Statistiken aus und nennt das Land dabei nur einmal
for(var j = 0; j < jsonObject.features.length; j++){
  console.log(jsonObject.features[j].properties.name);
  var timeLine = "2010"
  var reportYear = "Year" + timeLine;
  for(var k = 0; k < reportOne.length; k++){
    if(reportOne[k].Country == jsonObject.features[j].properties.name){
      if(reportOne[k].BeverageTypes == " Beer"){
        console.log(reportOne[k].BeverageTypes);
        console.log(reportOne[k][reportYear]);
        };

      if(reportOne[k].BeverageTypes == " Wine"){
        console.log(reportOne[k].BeverageTypes);
        console.log(reportOne[k][reportYear]);
        };

        if(reportOne[k].BeverageTypes == " Spirits"){
          console.log(reportOne[k].BeverageTypes);
          console.log(reportOne[k][reportYear]);
        };

        if(reportOne[k].BeverageTypes == " All types"){
          console.log(reportOne[k].BeverageTypes);
          console.log(reportOne[k][reportYear]);
        };
    };
  };
};

var cityArray = [];


for(var i = 0; i < jsonObject.features.length; i++){
  //console.log(jsonObject.features[i].geometry.coordinates[0][0]);
    if(jsonObject.features[i].geometry.coordinates[0][0].length == 2){
  var city = new ol.Feature({
      //feature name added
      name: jsonObject.features[i].properties.name
      //geometry: new ol.geom.Point(ol.proj.fromLonLat(jsonObject.features[i].geometry.coordinates[0][0]))
  });

  city.setStyle(new ol.style.Style({
      image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
          color: '#8959A8',
          scale: 1.7,
          crossOrigin: 'anonymous',
          src: 'https://openlayers.org/en/v4.1.1/examples/data/dot.png'
      }))
  }));
    cityArray.push(city);}
}


var countrySource = new ol.source.Vector({
    projection : 'EPSG:3857',
    url: 'data/countries.geo.json',
    format: new ol.format.GeoJSON(),
    features: cityArray

});


var countryStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: [203, 194, 185, 1]
  }),
  stroke: new ol.style.Stroke({
    color: [177, 163, 148, 0.5],
    width: 2.5
  })
});
var countryLayer = new ol.layer.Vector({
  source: countrySource,
    style: countryStyle
});


//Toner Layer for styling
var tonerLayer = new ol.layer.Tile({
    source: new ol.source.Stamen({
        layer: 'toner'
    })
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
            "<tr><td>Beer</td><td>"+ 1+"</td></tr>"+
            "<tr><td>Wine</td><td>"+2+"</td></tr>"+
            "<tr><td>Spirits</td><td>"+3+"</td></tr>"+
            "</table>";
    }
};

map.on('pointermove', displayTooltip);
