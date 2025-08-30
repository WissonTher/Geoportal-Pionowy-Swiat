const MAX_ZOOM = 18
const MIN_ZOOM = 6

var map = L.map('map', {
    maxZoom: MAX_ZOOM
}).setView([49.80, 19.19], 10);

var mapyczWinter = L.tileLayer(`https://api.mapy.cz/v1/maptiles/winter/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
});
//mapyczWinter.addTo(map);

var mapyczTourist = L.tileLayer(`https://api.mapy.cz/v1/maptiles/outdoor/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
});
mapyczTourist.addTo(map);

var mapyczSatelite = L.tileLayer(`https://api.mapy.cz/v1/maptiles/aerial/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
    minZoom: MIN_ZOOM,
    maxZoom: MAX_ZOOM,
    attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
});
//mapyczSatelite.addTo(map);

var mapyczBorder = L.tileLayer(`https://api.mapy.cz/v1/maptiles/names-overlay/256/{z}/{x}/{y}?apikey=${API_KEY}`, {
    minZoom: MIN_ZOOM+2,
    maxZoom: MAX_ZOOM,
    attribution: '<a href="https://api.mapy.cz/copyright" target="_blank">&copy; Seznam.cz a.s. a další</a>',
});
//mapyczBorder.addTo(map);

const LogoControl = L.Control.extend({
    options: {
        position: 'bottomleft',
    },

    onAdd: function (map) {
        const container = L.DomUtil.create('div');
        const link = L.DomUtil.create('a', '', container);

        link.setAttribute('href', 'http://mapy.cz/');
        link.setAttribute('target', '_blank');
        link.innerHTML = '<img src="https://api.mapy.cz/img/api/logo.svg" />';
        L.DomEvent.disableClickPropagation(link);
        return container;
    },
});

new LogoControl().addTo(map);

var wmsOrto = L.tileLayer.wms('https://mapy.geoportal.gov.pl/wss/service/PZGIK/ORTO/WMS/StandardResolution?', {
    layers: 'Raster',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    attribution: '&copy; Główny Urząd Geodezji i Kartografii (GUGiK)'
});
//wmsOrto.addTo(map);

var osm = L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png?{foo}', {
    foo: 'bar',
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
});
//osm.addTo(map);
        
var peaks = L.tileLayer.wms('https://mapy.geoportal.gov.pl/wss/service/img/guest/WMS/Szczyty?', {
    minZoom: 10,
    layers: 'szczyty',
    format: 'image/png',
    transparent: true,
    version: '1.3.0',
    minx: '12000.0',
    attribution: '&copy; Główny Urząd Geodezji i Kartografii (GUGiK)'
});
        
var parkiNarodowe = L.tileLayer.wms("http://sdi.gdos.gov.pl/wms", {
    layers: 'GDOS:ParkiNarodowe',
    format: 'image/png',
    transparent: true,
    attribution: 'Dane: GDOŚ'
});

var parkiKrajobrazowe = L.tileLayer.wms("http://sdi.gdos.gov.pl/wms", {
    layers: 'GDOS:ParkiKrajobrazowe',
    format: 'image/png',
    transparent: true,
    attribution: 'Dane: GDOŚ'
});

var googleSatelite = L.tileLayer('https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}', {
    maxZoom: MAX_ZOOM,
    subdomains: ['mt0', 'mt1', 'mt2', 'mt3'],
    attribution: '&copy; Google Maps'
});
//googleSatelite.addTo(map);

L.control.scale().addTo(map);

var baseLayers = {
    "Ortofotomapa": wmsOrto,
    "Google Maps": googleSatelite,
    "Satelita": mapyczSatelite,
    "Podkład zimowy": mapyczWinter,
    "Granice": mapyczBorder,
    "OpenStreetMap": osm,
    "Mapa turystuczna": mapyczTourist
};

overlays = {};

var layersControl = L.control.layers(baseLayers, overlays)

var zdobyteLayer = L.layerGroup();
var niezdobyteLayer = L.layerGroup();
var msbDoneLayer = L.layerGroup();
var loopDoneLayer = L.layerGroup();
var headquater = L.layerGroup();
var msbLayer = L.layerGroup();
var loopLayer = L.layerGroup();

map.createPane('niezdobytePane');
map.getPane('niezdobytePane').style.zIndex = 400;
map.createPane('zdobytePane');
map.getPane('zdobytePane').style.zIndex = 410;
var niezdobyteTatraLayer = L.layerGroup([], { pane: 'niezdobytePane' });
var zdobyteTatraLayer = L.layerGroup([], { pane: 'zdobytePane' });
var allMarkers = L.featureGroup();

var headquater = {
    "type": "FeatureCollection",
    "name": "siedziba",
    "features": [
        { "type": "Feature", "properties": { 
            "name": "Siedziba SK PTT \"Pionowy Świat\"",
            "address": "ul. Józefa Lompy 10",
            "postalcity": "43-300, Bielsko-Biała",
            "classroom": "208",
            "school": "V Liceum Ogólnokształcące",
            "color": "#c8ccce" }, 
            "geometry": { 
                "type": "Point", "coordinates": [ 19.041126, 49.818073] } },
    ]}

var headquarterLayer = L.geoJSON(headquater, {
    onEachFeature: function (feature, layer) {
        var popupContent = `
            <div style="display: flex; align-items: center;">
                <img src="${headquaterIcon.options.iconUrl}" style="width:50px;height:50px;margin-right:15px;">
                <div>
                    <b>${feature.properties.name}</b><br>
                    ${feature.properties.school} (sala ${feature.properties.classroom})<br>
                    ${feature.properties.address}<br>
                    ${feature.properties.postalcity}<br>
                </div>
            </div>
        `; 
        layer.bindPopup(popupContent);
    },
    pointToLayer: function (feature, latlng) {
        return L.marker(latlng, {
        icon: headquaterIcon
    });
}
}).addTo(map);

var groupedOverlays = {
    "Korona Gór Polski": {
        "Zdobyte": zdobyteLayer,
        "Niezdobyte": niezdobyteLayer
    },
    "Nasze górskie projekty": {
        "Mały Szlak Beskidzki": msbLayer,
        "The Loop": loopLayer
    },
    "Zdobyte fragmenty": {
        "Mały Szlak Beskidzki": msbDoneLayer,
        "The Loop": loopDoneLayer
    },
    "Tatry ponad wszystko": {
        "Zdobyte ": zdobyteTatraLayer,
        "Niezdobyte ": niezdobyteTatraLayer
    },
    "Usługa WMS": {
        "Szczyty Geoportal": peaks,
        "Parki Narodowe": parkiNarodowe,
        "Parki Krajobrazowe": parkiKrajobrazowe
    },
    "Dodatki": {
        "Siedziba": headquarterLayer
    }
};