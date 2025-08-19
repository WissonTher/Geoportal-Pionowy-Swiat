var layersControl = L.control.groupedLayers(baseLayers, groupedOverlays).addTo(map);

map.on('overlayadd', function(e) {
    if (e.layer === zdobyteTatraLayer || e.layer === niezdobyteTatraLayer) {
        var layerBounds = allMarkers.getBounds();
        var mapBounds = map.getBounds();

        if (!layerBounds.contains(mapBounds)) {
            map.fitBounds(layerBounds);
        }
    }
});

function updateLayerVisibility() {
    var zoom = map.getZoom();
    var visible = zoom >= 11;

    zdobyteTatraLayer.eachLayer(function(layer) {
        if (layer._icon) layer._icon.style.display = visible ? '' : 'none';
    });

    niezdobyteTatraLayer.eachLayer(function(layer) {
        if (layer._icon) layer._icon.style.display = visible ? '' : 'none';
    });
}

map.on('zoomend', updateLayerVisibility);
updateLayerVisibility();

map.attributionControl.setPrefix('<a href="http://leafletjs.com">Leaflet</a> | <a href="https://pionowylo5.pl">Szkolny Klub PTT "Pionowy Świat"</a>');