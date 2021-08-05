const SoMapHtml = `
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

        var map;
        function showMap(callback) {
            if (callback) {
                map.remove()
            }
            //Map Options
            var mapOptions = {
                zoomControl: false,
                attributionControl: false,
                center: [23.777176, 90.399452],
                zoom: 10,
                layers: [basemaps.GoogleMap]
            };

            //Render Main Map
            map = L.map("map", mapOptions);
            L.control.zoom({ position: 'topright' }).addTo(map);
            callback()
        }

        var prevMarkers = []

        function removePrevMarker() {
            for (let index = 0; index < prevMarkers.length; index++) {
                const element = array[index];

            }
        }

        function showMarker({ latitude, longitude, userName, locations }) {
            showMap(() => {
                // alert(locations?.length)
                var i;
                var icon;
                for (i = 0; i < locations.length; i++) {
                    var geo = locations[i]
                    var lat;
                    var long;

                    if (geo?.notVisited) {
                        lat = geo?.latitude
                        long = geo?.longitude
                    } else {
                        lat = geo?.latitude
                        long = geo?.longitude
                    }

                    icon = L.icon({
                        iconUrl: 'https://img.icons8.com/metro/100/26e07f/marker.png',
                        iconSize: [40, 40]
                    });


                    var marker = L.marker([lat, long], { icon: icon }).addTo(map);
                    marker.bindPopup("<b>" + geo?.employeeName + "</b> <p style='margin:0'>" + geo?.address + "</p>");
                }
                map.flyTo([geo[0]?.outletLat, geo[0]?.outletLong], 15)
            })

        }

        if (navigator.appVersion.includes('Android')) {
            document.addEventListener("message", function (data) {
                showMarker(JSON.parse(data.data))
            });
        }
        else {
            window.addEventListener("message", function (data) {
                showMarker(JSON.parse(data.data))
            });
        }

        showMap()
    </script>

</body>

</html>
`;

export default SoMapHtml;
