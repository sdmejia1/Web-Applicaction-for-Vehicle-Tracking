// jshint esversion: 6

let mymap = L.map('mapid').setView([11.0192, -74.8505], 15);
let hMymap = L.map('hmapid').setView([11.0192, -74.8505], 15);


L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoicHVjY2luaWMiLCJhIjoiY2swOTh3NHA2MDVoczNtbW5odXAybDlxbSJ9.ySZV9JduMLAW8DphUa4Bsg'
}).addTo(mymap);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    accessToken: 'pk.eyJ1IjoicHVjY2luaWMiLCJhIjoiY2swOTh3NHA2MDVoczNtbW5odXAybDlxbSJ9.ySZV9JduMLAW8DphUa4Bsg'
}).addTo(hMymap);


let markers = [[],[]];
let marker = L.marker([51.5, -0.09]).addTo(mymap);
let hMarker = L.marker([51.5, -0.09]).addTo(hMymap);
let polyline = L.polyline([], {
    color: 'green'
}).addTo(mymap);
let hPolyline = L.polyline([], {
    color: 'red'
}).addTo(hMymap);

window.setInterval(function() {
    const settings = {
        url: '/Appdata',
        success: function(data) {
            const lat = `<b>Latitud:</b> ${data.lat} `;
            const lon = `<b>Longitud:</b> ${data.lon} `;
            const time = `<b>Tiempo:</b> ${new Date(data.time).toString()} `;
            const texti = '<p>' + lat + lon + time + '</p>';
            $('#syrus').html(texti);
            const polyLength = polyline.getLatLngs().length;
            const lastPos = polyline.getLatLngs()[polyLength - 1];
            if (polyline.isEmpty() || ((data.lat != lastPos.lat) || (data.lon != lastPos.lng))) {
                polyline.addLatLng([data.lat, data.lon]);
                marker.setLatLng([data.lat, data.lon]);
                markers[0].push(L.circleMarker([data.lat, data.lon], 5).addTo(mymap).setRadius(1));
            }
        }
    };
    $.get(settings);
}, 5000);


$('.myButton').click(function() {
    const timeMargin = {
        initTime: new Date($('#init-date').val()).getTime(),
        finalTime: new Date($('#final-date').val()).getTime()
    };
    // cambio
    $.get('/search', timeMargin).done(function(data) {
        console.log(data);
        hMarker.setLatLng([51.5, -0.09]);
        hMymap.removeLayer(hPolyline);
        for(let i = markers[1].length - 1; i >= 0; i--){
            hMymap.removeLayer(markers[1][i]);
            markers[1].pop();
        }
        if (data.length != 0){
            let latlngs = [];
            data.forEach(function(row){
                let lastPos = latlngs[latlngs.length-1];
                if(latlngs.length === 0||(row.lat != lastPos[0] || row.lon != lastPos[1])){
                    latlngs.push([row.lat,row.lon]);
                    markers[1].push(L.circleMarker([row.lat,row.lon], 5).addTo(hMymap).setRadius(1));
                }
            });
            hPolyline = L.polyline(latlngs, {
                color: 'red'
            }).addTo(hMymap);
            hMarker.setLatLng(latlngs[latlngs.length-1]);
        } else {
            alert('no hay datos disponibles para esa fecha');
        }
    });
});
