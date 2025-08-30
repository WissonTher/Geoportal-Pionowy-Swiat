function switchBaseLayer(mode) {
    map.removeLayer(mapyczTourist);
    map.removeLayer(mapyczWinter);
    map.removeLayer(mapyczSatelite);
    map.removeLayer(mapyczBorder);
    map.removeLayer(wmsOrto);
    map.removeLayer(osm);
    map.removeLayer(googleSatelite);

    if (mode === 'summer') {
        map.addLayer(mapyczTourist);
    } else if (mode === 'winter') {
        map.addLayer(mapyczWinter);
    }
}

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

function updateTatryOverlayCount(mode) {
    let zdobyteCount = 0;
    let niezdobyteCount = 0;

    allMarkers.eachLayer(marker => {
        if (mode === 'summer') {
            if (marker.options.summerStatus) zdobyteCount++;
            else niezdobyteCount++;
        } else if (mode === 'winter') {
            if (marker.options.winterStatus) zdobyteCount++;
            else niezdobyteCount++;
        }
    });

    for (let i in layersControl._layers) {
        let layerObj = layersControl._layers[i];
        if (layerObj.name.startsWith("Zdobyte ")) {
            layerObj.name = `Zdobyte [${zdobyteCount}]`;
        }
        if (layerObj.name.startsWith("Niezdobyte ")) {
            layerObj.name = `Niezdobyte [${niezdobyteCount}]`;
        }
    }

    layersControl._update();
}

function updateMode(mode) {
    switchBaseLayer(mode);

    allMarkers.eachLayer(marker => {
        let options = marker.options[mode];

        marker.setIcon(options.icon);
        marker.bindPopup(options.popup);

        zdobyteTatraLayer.removeLayer(marker);
        niezdobyteTatraLayer.removeLayer(marker);

        if (mode === 'summer' && marker.options.summerStatus) {
            zdobyteTatraLayer.addLayer(marker);
        } else if (mode === 'summer') {
            niezdobyteTatraLayer.addLayer(marker);
        } else if (mode === 'winter' && marker.options.winterStatus) {
            zdobyteTatraLayer.addLayer(marker);
        } else {
            niezdobyteTatraLayer.addLayer(marker);
        }
    });
    updateTatryOverlayCount(mode);
}