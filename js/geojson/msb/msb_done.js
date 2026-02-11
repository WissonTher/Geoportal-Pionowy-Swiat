fetch('data/msb_done.geojson')
    .then(response => response.json())
    .then(data => {
        var msbDoneWhite = L.geoJSON(data, {
            pane: 'msbDonePane',
            style: function(feature) {
                return { color: "#003517", weight: 8, opacity: 0.9 };
            },
            interactive: false
        }).addTo(msbDoneLayer);

        var msbDoneGeojson = L.geoJSON(data, {
            pane: 'msbDonePane',
            style: function(feature) {
                return { color: "#73c53e", weight: 4, zIndex: 1};
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
                    }).addTo(msbDoneLayer);

                    L.circleMarker([c[1], c[0]], {
                        radius: 5,
                        fillColor: "#447523",
                        color: "#ffffff",
                        weight: 3,
                        fillOpacity: 1,
                        interactive: false,
                        pane: 'vertexPane'
                    }).addTo(msbDoneLayer);
                });
            }                    
        }).addTo(msbDoneLayer);
    })
    .catch(error => console.error("Błąd podczas wczytywania GeoJSON:", error));