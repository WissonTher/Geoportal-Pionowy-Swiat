fetch('data/project.geojson')
    .then(response => response.json())
    .then(data => {
        var projectGeojson = L.geoJSON(data, {
            pane: 'projectPane',
            style: function(feature) {
                return { color: "blue", weight: 3, zIndex: 0};
            },
            onEachFeature: function(feature, layer) {
                var props = feature.properties;
                var popupContent = `<b>${props.name}</b><br>` +
                `Długość: ${props.distance} km<br>` + 
                `Suma podejść: ${props.comeup} m<br>` +
                `Suma zejść: ${props.comedown} m`
                layer.bindPopup(popupContent);
            }                    
        }).addTo(projectLayer);
    })
    .catch(error => console.error("Błąd podczas wczytywania GeoJSON:", error));