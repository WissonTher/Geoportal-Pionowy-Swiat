fetch('data/tatry-ponad-wszystko.geojson?v=' + Date.now())
    .then(response => response.json())
    .then(data => {
        var tatrapeakGeojson = L.geoJSON(data, {
            pointToLayer: function(feature, latlng) {
                var props = feature.properties;

                let summerIcon = props.zdobyty
                    ? (props.rodzaj === "szczyt" ? greenIconSzczyt : greenIconPrzelecz)
                    : (props.rodzaj === "szczyt" ? redIconSzczyt : redIconPrzelecz);

                let summerPopup = `
                    <div style="display: flex; align-items: center;">
                        <img src="${summerIcon.options.iconUrl}" style="width:100px;height:100px;margin-right:15px;">
                        <div>
                            <b>${props.nazwa}</b><br>
                            Wysokość: ${props.wysokosc} m n.p.m.<br>
                            ${props.zdobyty 
                                ? `Status: <b>Zdobyty</b><br>Data: ${props.data_zdobycia || props.data}<br>` +
                                (props.instagram ? `<a href="${props.instagram}" target="_blank">Instagram</a>` : "")
                                : `Status: <b>Nie zdobyty</b>`}
                        </div>
                    </div>
                `;

                let winterIcon = props.zima
                    ? (props.rodzaj === "szczyt" ? blueIconSzczyt : blueIconPrzelecz)
                    : (props.rodzaj === "szczyt" ? greyIconSzczyt : greyIconPrzelecz);

                let winterPopup = `
                    <div style="display: flex; align-items: center;">
                        <img src="${winterIcon.options.iconUrl}" style="width:100px;height:100px;margin-right:15px;">
                        <div>
                            <b>${props.nazwa}</b><br>
                            Wysokość: ${props.wysokosc} m n.p.m.<br>
                            ${props.zima 
                                ? `Status: <b>Zdobyty zimą</b><br>Data: ${props.data_zima}<br>` +
                                (props.instagram ? `<a href="${props.instagram}" target="_blank">Instagram</a>` : "")
                                : `Status: <b>Nie zdobyty zimą</b>`}
                        </div>
                    </div>
                `;

                var marker = L.marker(latlng, { icon: summerIcon, pane: props.zdobyty ? 'zdobytePane' : 'niezdobytePane' });

                marker.options.summer = { icon: summerIcon, popup: summerPopup };
                marker.options.winter = { icon: winterIcon, popup: winterPopup };
                marker.bindPopup(summerPopup);

                marker.options.summerStatus = props.zdobyty;
                marker.options.winterStatus = props.zima;

                allMarkers.addLayer(marker);

                return marker;
            }
        });

        updateMode('summer');
    });