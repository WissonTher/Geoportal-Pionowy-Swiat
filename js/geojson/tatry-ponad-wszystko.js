fetch('data/tatry-ponad-wszystko.geojson?v=' + Date.now())
    .then(response => response.json())
    .then(data => {
                
        var tatrapeakGeojson = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                var props = feature.properties;
                let icon;
                if (props.zdobyty) {
                    if (props.rodzaj === "szczyt") {
                        icon = greenIconSzczyt;
                    } else {
                        icon = greenIconPrzelecz;
                    }
                } else {
                    if (props.rodzaj === "szczyt") {
                        icon = redIconSzczyt;
                    } else {
                        icon = redIconPrzelecz;
                    }
                }

                var marker = L.marker(latlng, { icon: icon, pane: props.zdobyty ? 'zdobytePane' : 'niezdobytePane' });

                if (props.zdobyty) {
                    zdobyteTatraLayer.addLayer(marker);
                } else {
                    niezdobyteTatraLayer.addLayer(marker);
                }
                allMarkers.addLayer(marker);

                return marker;
            },
            onEachFeature: function(feature, layer) {
                var props = feature.properties;
                var iconUrl = layer.options.icon.options.iconUrl;
                var popupContent = `
                    <div style="display: flex; align-items: center;">
                        <img src="${iconUrl}" style="width:100px;height:100px;margin-right:15px;">
                        <div>
                            <b>${props.nazwa}</b><br>
                            Wysokość: ${props.wysokosc} m n.p.m.<br>
                            ${props.zdobyty ? `Status: <b>Zdobyty</b><br>Data: ${props.data_zdobycia}<br>` +
                            (props.instagram ? `<a href="${props.instagram}" target="_blank">Instagram</a>` : "")
                            : `Status: <b>Nie zdobyty</b>`}
                        </div>
                    </div>
                `;
                layer.bindPopup(popupContent);
            }
        })
        //updateOverlayLabels();
    })
    .catch(error => console.error("Błąd podczas wczytywania GeoJSON:", error));