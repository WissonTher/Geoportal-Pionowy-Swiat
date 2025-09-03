fetch('data/korona-gor-polski.geojson?v=' + Date.now())
    .then(response => response.json())
    .then(data => {
        var kgpGeojson = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                var icon = feature.properties.zdobyty ? greenIcon : redIcon;
                var marker = L.marker(latlng, { icon: icon });

                marker.feature = feature;
                marker.feature.source = "Korona Gór Polski";

                if (feature.properties.zdobyty) {
                    zdobyteLayer.addLayer(marker);
                } else {
                    niezdobyteLayer.addLayer(marker);
                }
                searchLayer.addLayer(marker);

                return marker;
            },
            onEachFeature: function(feature, layer) {
                var iconUrl = feature.properties.zdobyty ? greenIcon.options.iconUrl : redIcon.options.iconUrl;
                var props = feature.properties;
                var popupContent = `
                    <div style="display: flex; align-items: center;">
                        <img src="${iconUrl}" style="width:75px;height:75px;margin-right:15px;">
                        <div>
                            <b>${props.nazwa}</b><br>
                            Wysokość: ${props.wysokosc} m n.p.m.<br>
                            Pasmo: ${props.pasmo}<br>
                                ${props.zdobyty
                                    ? `Status: <b>Zdobyty</b><br>Data: ${props.data_zdobycia}<br>
                                        ${props.instagram ? `<a href="${props.instagram}" target="_blank">Instagram</a>` : ""}` 
                                        : `Status: <b>Nie zdobyty</b>`}
                        </div>
                    </div>
                `;
                layer.bindPopup(popupContent);
            }
        });
        zdobyteLayer.addTo(map);
        niezdobyteLayer.addTo(map);
    })
    .catch(error => console.error("Błąd podczas wczytywania GeoJSON:", error));