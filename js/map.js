var layersControl = L.control.groupedLayers(baseLayers, groupedOverlays).addTo(map);

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
}

var mode = "summer";

var modeControl = L.control({position: 'topleft'});

modeControl.onAdd = function(map) {
    var div = L.DomUtil.create('div', 'mode-toggle');

    div.innerHTML = `
        <div class="mode-label">Sezon</div>
        <label class="switch">
            <input type="checkbox" id="modeCheckbox">
            <span class="slider">
                <span class="icon">${sunSVG}</span>
            </span>
        </label>
    `;

    var checkbox = div.querySelector("#modeCheckbox");
    var icon = div.querySelector(".icon");

    L.DomEvent.on(checkbox, 'change', function(e) {
        L.DomEvent.stopPropagation(e);
        L.DomEvent.preventDefault(e);

        mode = checkbox.checked ? "winter" : "summer";
        updateMode(mode);
        icon.innerHTML = (mode === "summer") ? sunSVG : snowflakeSVG;
        icon.style.color = (mode === "summer") ? "#525252" : "#FFFFFF";
    });

    return div;
};

modeControl.addTo(map);
updateMode(mode);


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