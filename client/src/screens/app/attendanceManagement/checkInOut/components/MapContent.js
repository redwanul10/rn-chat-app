const mapHtml = `
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.7.1/dist/leaflet.css"
        integrity="sha512-xodZBNTC5n17Xt2atTPuE1HxjVMSvLVW9ocqUKLsCC5CXdbqCmblAshOMAS6/keqq/sMZMZ19scR4PsZChSR7A=="
        crossorigin="" />
    <style>
        

        body {
            padding: 0;
            margin: 0;
        }

        html,
        body,
        #map {
            height: 100%;
        }
    </style>
</head>

<body>
    <div id="map"></div>

    <!-- Make sure you put this AFTER Leaflet's CSS -->
    <script src="https://unpkg.com/leaflet@1.7.1/dist/leaflet.js"
        integrity="sha512-XQoYMqMTK8LvdxXYG3nZ448hOEQiglfqkJs1NOQV44cWnUrBc8PkAOcXy20w0vlaXaVUearIOBhiXZ5V3ynxwA=="
        crossorigin=""></script>

    <script>
        //  var mymap = L.map('mapid').setView([51.505, -0.09], 13);
        //Init Overlays
        var overlays = {};

        //Init BaseMaps
        var basemaps = {
            "OpenStreetMaps": L.tileLayer(
                "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
                {
                    minZoom: 2,
                    maxZoom: 19,
                    id: "osm.streets"
                }
            ),
            "GoogleMap": L.tileLayer(
                "https://mt1.google.com/vt/lyrs=r&x={x}&y={y}&z={z}",
                {
                    minZoom: 2,
                    maxZoom: 19,
                    // zoomOffset: -1,
                    id: "google.street"
                }
            ),
            "Google-Satellite": L.tileLayer(
                "https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}",
                {
                    minZoom: 2,
                    maxZoom: 19,
                    id: "google.satellite"
                }
            ),
            "Google-Hybrid": L.tileLayer(
                "https://mt1.google.com/vt/lyrs=y&x={x}&y={y}&z={z}",
                {
                    minZoom: 2,
                    maxZoom: 19,
                    id: "google.hybrid"
                }
            )
        };

        //Map Options
        var mapOptions = {
            zoomControl: false,
            attributionControl: false,
            center: [13.87992, 45.9791],
            zoom: 10,
            layers: [basemaps.GoogleMap]
        };

        //Render Main Map
        var map = L.map("map", mapOptions);
        

        

        
        // map.setView([51.505, -0.09], 18);
        // map.setView([0, 0], 18);

        // setTimeout(()=>{
        //     var marker = L.marker([-29.0529434318608, 152.01910972595218]).addTo(map);

        // marker.bindPopup("<b>Hello</b> Redwan").openPopup();
        //     map.setView(new L.LatLng(-29.0529434318608, 152.01910972595218), 15);
        // },3000)

        function showMarker({latitude, longitude,userName}){
                var marker = L.marker([latitude, longitude]).addTo(map);

                marker.bindPopup("<b style='margin-left:10px'>Hello</b> ").openPopup();
                // map.setView(new L.LatLng(latitude, longitude), 15);
                map.flyTo([latitude, longitude], 15)
                // alert("done")
        }

        if(navigator.appVersion.includes('Android')){
            document.addEventListener("message", function (data) {
                showMarker(JSON.parse(data.data))
            });
        }
        else {
            window.addEventListener("message", function (data) {
                showMarker(JSON.parse(data.data))
             });
        }

        L.control.zoom({ position: 'topright' }).addTo(map);
        </script>

</body>

</html>
`


export default mapHtml