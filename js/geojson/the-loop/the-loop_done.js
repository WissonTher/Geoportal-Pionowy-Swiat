fetch('data/theloop_done.geojson')
    .then(response => response.json())
    .then(data => {
        var loopDoneWhite = L.geoJSON(data, {
            pane: 'loopDonePane',
            style: function(feature) {
                return { color: "#351d00", weight: 8, opacity: 0.9 };
            },
            interactive: false
        }).addTo(loopDoneLayer);

        var loopDoneGeojson = L.geoJSON(data, {
            pane: 'loopDonePane',
            style: function(feature) {
                return { color: "#ff8c00", weight: 3, opacity: 1 };
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
                        pane: 'loopDonePane'
                    }).addTo(loopDoneLayer);

                    L.circleMarker([c[1], c[0]], {
                        radius: 5,
                        fillColor: "#447523",
                        color: "#ffffff",
                        weight: 3,
                        fillOpacity: 1,
                        interactive: false,
                        pane: 'loopDonePane'
                    }).addTo(loopDoneLayer);
                });
            }
        }).addTo(loopDoneLayer);
    })
    .catch(error => console.error("Błąd:", error));