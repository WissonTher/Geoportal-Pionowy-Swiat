fetch('data/project_done.geojson')
    .then(response => response.json())
    .then(data => {
        var projectDoneGeojson = L.geoJSON(data, {
            pane: 'projectDonePane',
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
        }).addTo(projectDoneLayer);
    })
    .catch(error => console.error("Błąd podczas wczytywania GeoJSON:", error));