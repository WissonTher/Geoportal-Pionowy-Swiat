fetch('data/theloop_done.geojson')
    .then(response => response.json())
    .then(data => {
        var loopDoneGeojson = L.geoJSON(data, {
            style: function(feature) {
                return { color: "#73c53e", weight: 4, zIndex: 1};
            },
            onEachFeature: function(feature, layer) {
                var props = feature.properties;
                var popupContent = `<b>${props.name}</b><br>`
                layer.bindPopup(popupContent);
            }                    
        }).addTo(loopDoneLayer);
    })
    .catch(error => console.error("Błąd podczas wczytywania GeoJSON:", error));