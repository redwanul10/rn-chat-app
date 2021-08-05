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
        <script
        src="https://cdn.jsdelivr.net/npm/leaflet-polylinedecorator@1.6.0/dist/leaflet.polylineDecorator.min.js"></script>

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

        function showMarker({ latitude, longitude, userName, locations,polylineData }) {
            showMap(() => {

                if(locations?.length > 1){

                    var polyline = L.polyline(polylineData, { color: '#3388ff' }).addTo(map);
                    
                    var decorator = L.polylineDecorator(polyline, {
                        patterns: [{
                            offset: 15, /* pos of first arrow */ repeat: 55, /* dist between arrows */
                            symbol: L.Symbol.arrowHead({ // Define the arrow symbol
                                pixelSize: 10, // Size
                                polygon: false, // false: ^ shape, true: triangle shape.
                                pathOptions: { stroke: true } // Required to actually draw the arrow.
                            })
                        }]
                    }).addTo(map);
                }

                // alert(locations?.length)
                var i;
                var icon;
                for (i = 0; i < locations.length; i++) {
                    var geo = locations[i]
                    var lat;
                    var long;

                   
                        // lat = geo?.outletLat
                        // long = geo?.outletLong
                    

                    if (geo?.notVisited) {
                        lat = geo?.outletLat
                        long = geo?.outletLong
                    } else {
                        lat = geo?.latitude
                        long = geo?.longitiud
                    }

                    if (geo?.notVisited) {
                        icon = L.icon({
                            iconUrl: 'https://erp.ibos.io/domain/Document/DownlloadFile?id=60ee74a1f35b9d5d277825f0',
                            iconSize: [40, 40]
                        });
                    }

                    if (geo?.isOrder) {
                        icon = L.icon({
                            iconUrl: 'https://img.icons8.com/metro/100/26e07f/marker.png',
                            iconSize: [40, 40]
                        });
                    }

                    if (geo?.isNoOrder) {
                        icon = L.icon({
                            iconUrl: 'https://erp.ibos.io/domain/Document/DownlloadFile?id=60bda9d747097661d29daf9f',
                            iconSize: [40, 40]
                        });
                    }

                    if (geo?.isOrder && geo?.orderDistance > 25 ) {
                        icon = L.icon({
                            iconUrl: 'https://erp.ibos.io/domain/Document/DownlloadFile?id=60ee74c8f35b9d5d277825f2',
                            iconSize: [40, 40]
                        });
                    }


                    var marker = L.marker([lat, long], { icon: icon }).addTo(map);
                    marker.bindPopup("<b>" + geo?.outletName + "</b> <p style='margin:0'>" + geo?.ownerName + "</p><p style='margin:0'>" + geo?.mobileNumber + "</p><p style='margin:0'>" + geo?.outletAddress + "</p> " + "<p style='margin:0'>Last Sales Amount : " + geo?.lastSalesAmount + "</p> ");
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

export default mapHtml;
