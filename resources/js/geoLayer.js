var styleCache =  {};
var highestCountryCoordinateLon;
var highestCountryCoordinateLat;
var countryhighestvalue;
var highestValue = 0;
var averageConsume;
var countCountry;
var countConsume;
var currentFeature;
var vectorSource;
var vectorLayer;
var tooltip = document.getElementById('tooltip');

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

function styleFunction(tempFeature, resolution){
setUpValues(tempFeature,resolution);
//Color Function
    var value = parseFloat(tempFeature.O[selectedType]);
    var scalelevel = 8;
    legendData();
    var summand = highestBeverageValue/8;
    var color;
    var stroke = defaultStyle.stroke;

    // Color Country Conditions
    if(!value){
        color = '#bbb';
    };
    if (value < summand ){
        color = '#FFFFF0';
    };
    if (value == 0){
        color = '#90EE90';
    };
    if (value >= summand &&  value < 2*summand){
        color = '#fee0d2';
    };
    if (value >= 2*summand && value < 3*summand){
        color = '#fcbba1';
    };
    if (value >= 3*summand && value < 4*summand){
        color = '#fc9272';
    };
    if (value >= 4*summand && value < 5*summand){
        color = '#fb6a4a';
    };
     if (value >= 5*summand && value < 6*summand){
        color = '#ef3b2c';
    };
     if (value >= 6*summand && value < 7*summand){
        color = '#cb181d';
    };
     if (value >= 7*summand){
        color = '#99000d'
    };
    if(value == highestValue){
        stroke =1000;
        var highestValueCountryName = tempFeature.O.name;
        var long = centroidJSON[highestValueCountryName].LONG;
        var lat = centroidJSON[highestValueCountryName].LAT;
        highestValueIcon.getGeometry().setCoordinates(ol.proj.fromLonLat([long,lat]));
        highestValueIcon.set("name", tempFeature.O.name);
        highestValueIcon.set(" Beer", tempFeature.O[" Beer"]);
        highestValueIcon.set(" Wine", tempFeature.O[" Wine"]);
        highestValueIcon.set(" Spirits", tempFeature.O[" Spirits"]);
        highestValueIcon.set(" All types", tempFeature.O[" All types"]);
     };
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

var overlay = new ol.Overlay({
    element: tooltip,
    offset: [10, 0],
    positioning: 'bottom-left'
});

overlay.setMap(map);

var highestValueIcon = new ol.Feature({
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
        return feature;
    });

    tooltip.style.display = feature ? '' : 'none';
    if (feature) {
        overlay.setPosition(evt.coordinate);
        tooltip.innerHTML = "<h4>"+feature.O.name+"</h4>"
    };
};

map.on('pointermove', displayTooltip);
map.on('click', function(evt) {
    if(map.getView().getZoom()<=3){
        map.getView().setCenter(evt.coordinate);
        map.getView().setZoom(map.getView().getZoom()+2);

}else{
        map.getView().setCenter(evt.coordinate);
    };
});

map.on('pointermove', function(evt) {
    var pixel = evt.pixel;
    var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
        //console.log("feature",feature);
        if(feature.O[" Beer"] === undefined || feature.O[" Beer"] === "null" || feature.O[" Beer"] === "") {
            feature.set(" Beer", "N.A.");
            feature.set(" Wine", "N.A.");
            feature.set(" Spirits", "N.A.");
            feature.set(" All types", "N.A.");

        }
        return feature;

    });

if(feature!== undefined && feature!== null) {
    var rect = $('.beer .name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
    var size = (feature.O[" Beer"]) / 6;
    if (feature.O[" Beer"] == "N.A.") {
        size = 0;
    };
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);
    $('.beer .name .consume').text(feature.O[" Beer"] + " L");

    if (feature.O[" Beer"] == "N.A.") {
        $('.beer .name .consume').text(feature.O[" Beer"]);
    }

    var rect = $('.wine .name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
    var size = (feature.O[" Wine"]) / 6;
    if (feature.O[" Wine"] == "N.A.") {
        size = 0;
    };
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);
    $('.wine .name .consume').text(feature.O[" Wine"] + " L");
    if (feature.O[" Wine"] == "N.A.") {
        $('.wine .name .consume').text(feature.O[" Wine"]);
    }

    var rect = $('.whisky .name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
    var size = (feature.O[" Spirits"]) / 6;
    if (feature.O[" Spirits"] == "N.A.") {
        size = 0;
    };
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);
    $('.whisky .name .consume').text(feature.O[" Spirits"] + " L");
    if (feature.O[" Spirits"] == "N.A.") {
        $('.whisky .name .consume').text(feature.O[" Spirits"]);
    }

    var rect = $('.alcopop .name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
    var size = (feature.O[" All types"]) / 20;
    if (feature.O[" All types"] == "N.A.") {
        size = 0;
    };
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);
    $('.alcopop .name .consume').text(feature.O[" All types"] + " L");
    if (feature.O[" All types"] == "N.A.") {
        $('.alcopop .name .consume').text(feature.O[" All types"]);
    }


    $('.country p').text(feature.O.name);

    if(feature.O.name!==undefined) {
        if(feature.O.name.toString() === "French Southern and Antarctic Lands"){
            $(".flag").attr("src", "https://lipis.github.io/flag-icon-css/flags/4x3/" + "fr" + ".svg");
        }
        else {
        $(".flag").attr("src", "https://lipis.github.io/flag-icon-css/flags/4x3/" + inverseCountryCodes[feature.O.name.toString()].toLowerCase() + ".svg");
        };
      };
    };

});

map.on('click', function(evt) {
    var pixel = evt.pixel;
    var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
    currentFeature = feature;
    manageGraph(feature);
        if(feature !== undefined) {
          return feature;
        };
    });
    if(feature!== undefined) {
  };
});

map.on('click', function(evt) {
    if(map.getView().getZoom()<=3){
        map.getView().setCenter(evt.coordinate);
        map.getView().setZoom(map.getView().getZoom()+2);
    }else{
        map.getView().setCenter(evt.coordinate);
    }
});

function changeSize(size, el) {
    var tl = new TimelineMax();
    tl.to(el, 0.4, {scaleY: size, transformOrigin: '50% 100%'});
}
