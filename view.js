var map;
var infoWindow;
var service;
var directionsService;
var directionsDisplay;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 36.109979, lng: 140.101418},
    zoom: 15,
    styles: [{
      stylers: [{ visibility: 'simplified' }]
    }, {
      elementType: 'labels',
      stylers: [{ visibility: 'off' }]
    }]
  });

  infoWindow = new google.maps.InfoWindow();
  service = new google.maps.places.PlacesService(map);
  directionsService = new google.maps.DirectionsService();
  directionsDisplay = new google.maps.DirectionsRenderer();

  // The idle event is a debounced event, so we can query & listen without
  // throwing too many requests at the server.
  map.addListener('idle', performSearch);
}

function performSearch() {
  var request = {
  	location: new google.maps.LatLng(36.109979, 140.101418),
    radius: 5000,
    keyword: 'best view'
  };
  service.radarSearch(request, callback);
}

function callback(results, status) {
  if (status !== google.maps.places.PlacesServiceStatus.OK) {
    console.error(status);
    return;
  }
  for (var i = 0;i < results.length;i++) {
    addMarker(results[i]);
  }
  if (results.length > 1) {
    directRoute(results[0], results[1]);
  }
}

function addMarker(place) {
  var marker = new google.maps.Marker({
    map: map,
    position: place.geometry.location,
    icon: {
      url: 'http://maps.gstatic.com/mapfiles/circle.png',
      anchor: new google.maps.Point(10, 10),
      scaledSize: new google.maps.Size(10, 17)
    }
  });

  google.maps.event.addListener(marker, 'click', function() {
    service.getDetails(place, function(result, status) {
      if (status !== google.maps.places.PlacesServiceStatus.OK) {
        console.error(status);
        return;
      }
      infoWindow.setContent(result.name);
      infoWindow.open(map, marker);
    });
  });
}

function directRoute(origin, dest) {
  var request = {
    origin: origin.geometry.location,
    destination: dest.geometry.location,
    travelMode: google.maps.DirectionsTravelMode.WALKING
  }
  directionsService.route(request, function(result, status) {
    if (status !== google.maps.places.PlacesServiceStatus.OK) {
      console.error(status);
      return;
    }
    directionsDisplay.setDirections(result); //取得した情報をset
    directionsDisplay.setRouteIndex(0); //ルートのインデックスを指定
    directionsDisplay.setMap(map); //マップに描画
  });
}
