fetch('data/karpatia.geojson')
    .then(response => response.json())
    .then(data => {
        var karpatiaGeojson = L.geoJSON(data, {
            pane: 'karpatiaPane',
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
        }).addTo(karpatiaLayer);
    })
    .catch(error => console.error("Błąd podczas wczytywania GeoJSON:", error));