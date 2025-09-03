var searchLayer = L.layerGroup().addTo(map);

var searchControl = new L.Control.Search({
    layer: searchLayer,
    propertyName: 'nazwa',
    marker: false,
    moveToLocation: function(latlng, title, map) {
        map.setView(latlng, 12);
    },
    buildTip: function(text, val) {
        if (!val || !val.layer || !val.layer.feature) {
            return text || "";
        }
        
        var source = val.layer.feature.source || "";
        var props = val.layer.feature.properties || {};
        var wysokosc = props.wysokosc || "";
        var sourceColor = '';
        var sourceClass = '';        
        if (source === 'Korona Gór Polski') {
            sourceColor = '#2c5aa0';
            sourceClass = 'source-kgp';
        } else if (source === 'Tatry Ponad Wszystko') {
            sourceColor = '#d4a017';
            sourceClass = 'source-tatry';
        }
        var result = '<div class="search-result">';
        result += '<b>' + text + '</b>';
        
        if (wysokosc) {
            result += ' <small>(' + wysokosc + ' m n.p.m.)</small>';
        }
        
        if (source) {
            result += '<br><span class="source-badge ' + sourceClass + '" style="background-color: ' + sourceColor + '">' + source + '</span>';
        }
        
        result += '</div>';
        return result;
    }
});

searchControl.on('search:locationfound', function(e) {
    if (e.layer._popup)
        e.layer.openPopup();
});

map.addControl(searchControl);

setTimeout(() => {
    const searchContainer = document.querySelector('.leaflet-control-search');
    if (searchContainer) {
        const searchLabel = document.createElement('label');
        searchLabel.textContent = "Wyszukaj szczyt:";
        searchLabel.classList.add('search-label');
        searchContainer.prepend(searchLabel);
    }
}, 100);