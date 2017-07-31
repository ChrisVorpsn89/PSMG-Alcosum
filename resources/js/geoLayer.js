//Creating the variables for the module
var countryhighestvalue;
var highestValue = 0;
var averageConsume;
var countCountry;
var countConsume;
var currentFeature;
var vectorSource;
var vectorLayer;
var tooltip = document.getElementById('tooltip');

const DEFAULT_ZOOM_LEVEL = 2,
    MAX_ZOOM = 3,
    TOTAL_CONSUME_DIVISION_FACTOR = 20,
    DRINKS_DIVISION_FACTOR = 6,
    DEFAULT_SIZE = 0,
    ICON_SCALE_LEVEL = 0.2;
//
var countrySource = new ol.source.Vector({
    projection : 'EPSG:3857',
    url: 'data/countries.geo.json',
    format: new ol.format.GeoJSON()
});

//
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
    }
    if (value < summand ){
        color = '#FFFFF0';
    }
    if (value == 0){
        color = '#90EE90';
    }
    if (value >= summand &&  value < 2*summand){
        color = '#fee0d2';
    }
    if (value >= 2*summand && value < 3*summand){
        color = '#fcbba1';
    }
    if (value >= 3*summand && value < 4*summand){
        color = '#fc9272';
    }
    if (value >= 4*summand && value < 5*summand){
        color = '#fb6a4a';
    }
    if (value >= 5*summand && value < 6*summand){
        color = '#ef3b2c';
     }
    if (value >= 6*summand && value < 7*summand){
        color = '#cb181d';
     }
    if (value >= 7*summand){
        color = '#99000d'
     }
    if(value == highestValue){
        stroke =1000;

        //Setting the value of the variable to the country's name that has the highest value to access it below
        var highestValueCountryName = tempFeature.O.name;
        //Setting the Icon for the country with the highest consume and positioning it
        var long = centroidJSON[highestValueCountryName].LONG;
        var lat = centroidJSON[highestValueCountryName].LAT;
        highestValueIcon.getGeometry().setCoordinates(ol.proj.fromLonLat([long,lat]));
        //Fix to show correct values and name while hovering over icon
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


// Setting the initial center and zoom level of the map
var center = ol.proj.transform([0, 0], 'EPSG:4326', 'EPSG:3857');
var view = new ol.View ({
  center: ol.proj.transform([0, 33.82], 'EPSG:4326', 'EPSG:3857'),
  zoom: DEFAULT_ZOOM_LEVEL
});

//Creating the map and adding its layers
var map = new ol.Map({
 target: 'map',
  //Layers added to Array
  layers: [countryLayer,terrainLabelLayer],
  view: view
});

//Adding an overlay for the Tooltip
var overlay = new ol.Overlay({
    //Initial positioning and offset of the Tooltip
    element: tooltip,
    offset: [10, 0],
    positioning: 'bottom-left'
});

//Adding the overlay to the map
overlay.setMap(map);

//Creating the the initial location for Icon for the country with the highest value as
//an OpenLayers Point
var highestValueIcon = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([0,0]))
});

//Setting the Icon for the highest value and scaling it
//ICON from https://www.iconfinder.com/search/?q=award&license=2&price=free , no attribution required
highestValueIcon.setStyle(new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        scale: ICON_SCALE_LEVEL,
        crossOrigin: 'anonymous',
        src: 'resources/img/if_advantage_quality_1034364.png'
    }))
}));

//Creating the source with the Icon added to add it to the Layer below
vectorSource = new ol.source.Vector({
    features: [highestValueIcon]
});

//Vector Layer to hold the Icon for the highest value
vectorLayer = new ol.layer.Vector({
    source: vectorSource
});

//Adding the Vector Layer after clearing it from the map
map.removeLayer(vectorLayer);
map.addLayer(vectorLayer);

//Tooltip code with help from OpenLayers examples.
//Displaying the Tooltip if the given country does exist and have a name
//This prevents errors whilst hovering over e.g. the ocean
function displayTooltip(evt) {
    //Pixel of the hover event and the feature on it's location
    var pixel = evt.pixel;
    var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
        return feature;
    });

    //Tooltip only displays name of country if the feature and hence the name does exist
    tooltip.style.display = feature ? '' : 'none';
    if (feature) {
        //Setting coordinate and HTML text of the tooltip at the hover position
        overlay.setPosition(evt.coordinate);
        tooltip.innerHTML = "<h4>"+feature.O.name+"</h4>"
    }
}
//Displaying the Tooltip if necessary while user is hovering
map.on('pointermove', displayTooltip);
//Onclick function center the map and zoom
map.on('click', function(evt) {
    if(map.getView().getZoom()<=MAX_ZOOM){
        //only zooming by two steps
        map.getView().setCenter(evt.coordinate);
        map.getView().setZoom(map.getView().getZoom()+DEFAULT_ZOOM_LEVEL);

}else{
        //Centering the view for the user
        map.getView().setCenter(evt.coordinate);
    }
});

//Function to animate the Icons, the Flag and the consume
map.on('pointermove', function(evt) {
    var pixel = evt.pixel;
    //Pixel of the hover event and the feature on it's location
    var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
        //Catches Bugs that are caused when the feature is not in the dataset or undefined
        if(feature.O[" Beer"] === undefined || feature.O[" Beer"] === "null" || feature.O[" Beer"] === "") {
            feature.set(" Beer", "N.A.");
            feature.set(" Wine", "N.A.");
            feature.set(" Spirits", "N.A.");
            feature.set(" All types", "N.A.");

        }
        return feature;

    });

    //Initial bug catch to prevent animation problems that are caused when the feature is undefined or null
if(feature!== undefined && feature!== null) {
    //The following code has been inspired by Peter Allen https://codepen.io/evilpingwin/pen/LNVWYa
    //but has been heavily changed to represent the consume of any given alcohol type

    //setting the quantity of the SVG drink's fill level after selecting the right one via JQuery
    var rect = $('.beer .name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
    //Division of the size value to give the user a quick comparable OVERVIEW - not exact level - of the amount
    var size = (feature.O[" Beer"]) / DRINKS_DIVISION_FACTOR;
    //Catches bugs that occur when the size cant be set because the feature is not a number
    if (feature.O[" Beer"] == "N.A.") {
        size = DEFAULT_SIZE;
    }
    //Updating the animation and changing size
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);
    //setting the text and the EXACT amount of the consume
    $('.beer .name .consume').text(feature.O[" Beer"] + " L");
//Setting N.A. whenever the amount of consumed alcohol is not given
    if (feature.O[" Beer"] == "N.A.") {
        $('.beer .name .consume').text(feature.O[" Beer"]);
    }

    //setting the quantity of the SVG drink's fill level after selecting the right one via JQuery
    var rect = $('.wine .name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
    //Division of the size value to give the user a quick comparable OVERVIEW - not exact level - of the amount
    var size = (feature.O[" Wine"]) / DRINKS_DIVISION_FACTOR;
    //Catches bugs that occur when the size cant be set because the feature is not a number
    if (feature.O[" Wine"] == "N.A.") {
        size = DEFAULT_SIZE;
    }
    //Updating the animation and changing size
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);
    //setting the text and the EXACT amount of the consume
    $('.wine .name .consume').text(feature.O[" Wine"] + " L");
    if (feature.O[" Wine"] == "N.A.") {
        $('.wine .name .consume').text(feature.O[" Wine"]);
    }
    //setting the quantity of the SVG drink's fill level after selecting the right one via JQuery
    var rect = $('.whisky .name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
    //Division of the size value to give the user a quick comparable OVERVIEW - not exact level - of the amount
    var size = (feature.O[" Spirits"]) / DRINKS_DIVISION_FACTOR;
    //Catches bugs that occur when the size cant be set because the feature is not a number
    if (feature.O[" Spirits"] == "N.A.") {
        size = DEFAULT_SIZE;
    }
    //Updating the animation and changing size
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);
    //setting the text and the EXACT amount of the consume
    $('.whisky .name .consume').text(feature.O[" Spirits"] + " L");
    if (feature.O[" Spirits"] == "N.A.") {
        $('.whisky .name .consume').text(feature.O[" Spirits"]);
    }
    //setting the quantity of the SVG drink's fill level after selecting the right one via JQuery
    var rect = $('.alcopop .name p').parent().siblings('svg').find('rect:not(rect:nth-child(5))');
    //Division of the size value to give the user a quick comparable OVERVIEW - not exact level - of the amount
    var size = (feature.O[" All types"]) / TOTAL_CONSUME_DIVISION_FACTOR;
    //Catches bugs that occur when the size cant be set because the feature is not a number
    if (feature.O[" All types"] == "N.A.") {
        size = DEFAULT_SIZE;
    }
    //Updating the animation and changing size
    $(this).addClass('current');
    $(this).siblings().removeClass('current');
    changeSize(size, rect);
    //setting the text and the EXACT amount of the consume
    $('.alcopop .name .consume').text(feature.O[" All types"] + " L");
    if (feature.O[" All types"] == "N.A.") {
        $('.alcopop .name .consume').text(feature.O[" All types"]);
    }

//Setting the Name of the country while hovering over it
    $('.country p').text(feature.O.name);

    //Setting the correct flag icon from http://flag-icon-css.lip.is/
    if(feature.O.name!==undefined) {
        //Bug catch for French Southern and Antarctic Lands
        if(feature.O.name.toString() === "French Southern and Antarctic Lands"){
            $(".flag").attr("src", "https://lipis.github.io/flag-icon-css/flags/4x3/" + "fr" + ".svg");
        }
        else {
            //Getting the correct flag from the github repository
        $(".flag").attr("src", "https://lipis.github.io/flag-icon-css/flags/4x3/" + inverseCountryCodes[feature.O.name.toString()].toLowerCase() + ".svg");
        }
      }
    }

});

map.on('click', function(evt) {
    var pixel = evt.pixel;
    var feature = map.forEachFeatureAtPixel(pixel, function(feature) {
    currentFeature = feature;
    manageGraph(feature);
        if(feature !== undefined) {
          return feature;
        }
    });
    if(feature!== undefined) {
    }
});

map.on('click', function(evt) {
    if(map.getView().getZoom()<=MAX_ZOOM){
        map.getView().setCenter(evt.coordinate);
        map.getView().setZoom(map.getView().getZoom()+DEFAULT_ZOOM_LEVEL);
    }else{
        map.getView().setCenter(evt.coordinate);
    }
});

function changeSize(size, el) {
    var tl = new TimelineMax();
    tl.to(el, 0.4, {scaleY: size, transformOrigin: '50% 100%'});
}
