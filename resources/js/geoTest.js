

var vectorSource = new ol.source.Vector({
    projection : 'EPSG:3857',
    url: 'data/countries.geo.json',
    format: new ol.format.GeoJSON(),

});
var countryStyle = new ol.style.Style({
  fill: new ol.style.Fill({
    color: [203, 194, 185, 1]
  }),
  stroke: new ol.style.Stroke({
    color: [177, 163, 148, 0.5],
    width: 2
  })
});
var countryLayer = new ol.layer.Vector({
  source: countrySource,
    style: countryStyle
});

var center = ol.proj.transform([0, 0], 'EPSG:4326', 'EPSG:3857');
var view = new ol.View ({
  center: center,
  zoom: 1,
});
var map = new ol.Map({
 target: 'map',
  layers: [countryLayer],
  view: view
});