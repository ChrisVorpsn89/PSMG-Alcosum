var rome = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([12.5, 41.9]))
});

var london = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([-0.12755, 51.507222]))
});

var madrid = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([-3.683333, 40.4]))
});

rome.setStyle(new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        color: '#8959A8',
        crossOrigin: 'anonymous',
        src: 'https://openlayers.org/en/v4.1.1/examples/data/dot.png'
    }))
}));

london.setStyle(new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        color: '#4271AE',
        crossOrigin: 'anonymous',
        src: 'https://openlayers.org/en/v4.1.1/examples/data/dot.png'
    }))
}));

madrid.setStyle(new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        color: [113, 140, 0],
        crossOrigin: 'anonymous',
        src: 'https://openlayers.org/en/v4.1.1/examples/data/dot.png'
    }))
}));



var vectorSource = new ol.source.Vector({
    projection : 'EPSG:3857',
    url: 'data/countries.geo.json',
    format: new ol.format.GeoJSON(),
    features: [rome, london, madrid]

});
var vectorLayer = new ol.layer.Vector({
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