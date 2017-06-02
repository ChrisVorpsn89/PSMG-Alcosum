var rome = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([15.520376,38.231155]))
});

var london = new ol.Feature({
    geometry: new ol.geom.Point(ol.proj.fromLonLat([-5.661949,54.554603]))
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


var countrySource = new ol.source.Vector({
    projection : 'EPSG:3857',
    url: 'data/countries.geo.json',
    format: new ol.format.GeoJSON(),
    features: [rome, london, madrid]

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

// Code Toner Layer

var tonerLayer = new ol.layer.Tile({
    source: new ol.source.Stamen({
        layer: 'toner'
    })
});

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

<<<<<<< HEAD

=======
>>>>>>> origin/master
var map = new ol.Map({
 target: 'map',
  layers: [countryLayer,terrainLabelLayer],
  view: view
});
