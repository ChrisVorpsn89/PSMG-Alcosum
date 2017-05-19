var vectorSource = new ol.source.GeoJSON({
  projection: 'EPSG:3857',
  url: '..data/geojsoncouuntriesandcodes'
});
var vectorLayer = new ol.layer.vector({
  source: vectorSource
});
var center = ol.proj.transform([0, 0], 'EPSG:4326', 'EPSG:3857');
var view = new ol.View ({
  center: center,
  zoom: 1,
});
var map = new ol.Map({
 target: 'map',
  layers: [vectorLayer],
  view: view
});
