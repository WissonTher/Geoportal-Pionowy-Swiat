var layersControl = L.control.groupedLayers(baseLayers, groupedOverlays).addTo(map);

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

let firstLaunch = false;

map.on('overlayadd', function(e) {
    if (!firstLaunch) return;

    if (e.layer === zdobyteTatraLayer || e.layer === niezdobyteTatraLayer) {
        var layerBounds = allMarkers.getBounds();
        if (!layerBounds.contains(map.getBounds())) {
            map.fitBounds(layerBounds);
        }
    }
});
setTimeout(() => {
    firstLaunch = true;
}, 500);

map.on('zoomend', updateLayerVisibility);
updateLayerVisibility();

map.attributionControl.setPrefix('<a href="http://leafletjs.com">Leaflet</a> | <a href="https://pionowylo5.pl">Szkolny Klub PTT "Pionowy Świat"</a>');