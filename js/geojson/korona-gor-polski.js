fetch('data/korona-gor-polski.geojson?v=' + Date.now())
    .then(response => response.json())
    .then(data => {
        var kgpGeojson = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                var icon = feature.properties.zdobyty ? greenIcon : redIcon;
                var marker = L.marker(latlng, { icon: icon });

                if (feature.properties.zdobyty) {
                    zdobyteLayer.addLayer(marker);
                } else {
                    niezdobyteLayer.addLayer(marker);
                }

                return marker;
            },
            onEachFeature: function(feature, layer) {
                var props = feature.properties;
                var popupContent = `<b>${props.nazwa}</b><br>` +
                    `Wysokość: ${props.wysokosc} m n.p.m.<br>` +
                    `Pasmo: ${props.pasmo}<br>` +
                    (props.zdobyty ? `Status: <b>Zdobyty</b><br>Data: ${props.data_zdobycia}<br>` +
                    (props.instagram ? `<a href="${props.instagram}" target="_blank">Instagram</a>` : "") :
                    `Status: <b>Nie zdobyty</b>`);
                layer.bindPopup(popupContent);
            }
        });
        zdobyteLayer.addTo(map);
        niezdobyteLayer.addTo(map);

        var searchControl = new L.Control.Search({
            layer: kgpGeojson,
            propertyName: 'nazwa',
            initial: false,
            zoom: 15,
            marker: false,
            moveToLaction: function(latlng, title, map) {
                map.setView(latlng, 12);
            }
        })
        map.addControl(searchControl);

        var searchContainer = document.querySelector('.leaflet-control-search');
        var searchLabel = document.createElement('label');
        searchLabel.textContent = "Wyszukaj szczyt KGP:";
        searchLabel.classList.add('search-label');
        searchContainer.prepend(searchLabel);
    })
    .catch(error => console.error("Błąd podczas wczytywania GeoJSON:", error));