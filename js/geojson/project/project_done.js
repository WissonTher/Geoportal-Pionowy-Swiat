fetch('data/project_done.geojson')
    .then(response => response.json())
    .then(data => {
        var projectDoneWhite = L.geoJSON(data, {
            pane: 'projectDonePane',
            style: function(feature) {
                return { color: "#300035", weight: 8, opacity: 0.9 };
            },
            interactive: false
        }).addTo(projectDoneLayer);

        var projectDoneGeojson = L.geoJSON(data, {
            pane: 'projectDonePane',
            style: function(feature) {
                return { color: "#ee49f4", weight: 4, zIndex: 1};
            },
            onEachFeature: function(feature, layer) {
                var props = feature.properties;
                var popupContent = `<b>${props.name}</b><br>` +
                `Data przejścia: ${props.date}<br>` +
                `<a href="${props.instagram}" target="_blank">Instagram</a>`
                layer.bindPopup(popupContent);

                var coords = feature.geometry.coordinates;
                [coords[0], coords[coords.length - 1]].forEach(c => {
                    L.circleMarker([c[1], c[0]], {
                        radius: 6,
                        color: "#000000",
                        fillOpacity: 1,
                        interactive: false,
                        pane: 'vertexPane'
                    }).addTo(projectDoneLayer);

                    L.circleMarker([c[1], c[0]], {
                        radius: 5,
                        fillColor: "#447523",
                        color: "#ffffff",
                        weight: 3,
                        fillOpacity: 1,
                        interactive: false,
                        pane: 'vertexPane'
                    }).addTo(projectDoneLayer);
                });
            }                    
        }).addTo(projectDoneLayer);
    })
    .catch(error => console.error("Błąd podczas wczytywania GeoJSON:", error));