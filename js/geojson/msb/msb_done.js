fetch('data/msb_done.geojson')
    .then(response => response.json())
    .then(data => {
        var msbDoneGeojson = L.geoJSON(data, {
            style: function(feature) {
                return { color: "#73c53e", weight: 4, zIndex: 1};
            },
            onEachFeature: function(feature, layer) {
                var props = feature.properties;
                var popupContent = `<b>${props.name}</b><br>` +
                `Data przejścia: ${props.date}<br>` +
                `<a href="${props.instagram}" target="_blank">Instagram</a>`
                layer.bindPopup(popupContent);
            }                    
        }).addTo(msbDoneLayer);
    })
    .catch(error => console.error("Błąd podczas wczytywania GeoJSON:", error));