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


/*
for(var i = 0; i < jsonObject.features.length; i++){
  //console.log(jsonObject.features[i].geometry.coordinates[0][0]);
    if(jsonObject.features[i].geometry.coordinates[0][0].length == 2){
  var city = new ol.Feature({
      geometry: new ol.geom.Point(ol.proj.fromLonLat(jsonObject.features[i].geometry.coordinates[0][0]))
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

var styleCache =  {};

function styleFunction(tempFeature, resolution) {
    
  var timeLine = "2010"
  var reportYear = "Year" + timeLine;
  for(var k = 0; k < reportOne.length; k++){
    if(reportOne[k].Country == tempFeature.O.name){
      if(reportOne[k].BeverageTypes == " Beer"){
        console.log(reportOne[k].BeverageTypes);
        console.log(reportOne[k][reportYear]);
       
        tempFeature.set("beer", reportOne[k][reportYear]);  

       
        console.log("HURE");
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

      var a = parseFloat(tempFeature.O.beer); 
      var color;     
       if(a < 1){
             color = '#00FF00';
          }    
        if(a > 2){
             color = '#FF0000';
          }    
          if(a > 1 && a < 2){
             color= '#FFFF00';  
          }                                   
            
        console.log(tempFeature);
        style = new ol.style.Style({
          fill: new ol.style.Fill({
          
           
            color: color
            
            
         
          }),
          stroke: defaultStyle.stroke
        });
    return style;
      }
      
    


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
