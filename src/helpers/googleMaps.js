import data from '../data/googleMapsStyle'
export { displayLocationRoute, reviewGoogleMaps }

/**
 * @name displayLocationRoute
 * @description The function is used to display the map on the home screen when the both the
 *              pickup location and drop location is being selected and is used to display the
 *              route between the start point to destination location.
 */
function displayLocationRoute (selectedPosition) {
  let self = this
  var directionsDisplay
  var directionsService = new google.maps.DirectionsService()
  var map
  directionsDisplay = new google.maps.DirectionsRenderer({
    suppressMarkers: true,
    preserveViewport: true,
    polylineOptions: {
      strokeColor: 'rgb(25, 118, 210)'
    }
  })
  var startLat = new google.maps.LatLng(selectedPosition.pickupLatitude, selectedPosition.pickUpLongitude);
  var mapOptions = {
    zoom: 5,
    center: startLat,
    disableDefaultUI: true,
    gestureHandling: 'greedy',
    mapTypeControl: false,
    clickableIcons: false,
    styles: data.grayStyles
  }
  map = new google.maps.Map(document.getElementById('map'), mapOptions)
  directionsDisplay.setMap(map)
  var start = new google.maps.LatLng(selectedPosition.pickupLatitude, selectedPosition.pickUpLongitude)
  var end = new google.maps.LatLng(selectedPosition.dropLatitude, selectedPosition.dropLongitude)
  var bounds = new google.maps.LatLngBounds()
  bounds.extend(start)
  bounds.extend(end)
  map.fitBounds(bounds)
  var request = {
    origin: start,
    destination: end,
    travelMode: google.maps.TravelMode.DRIVING
  }
  directionsService.route(request, function (response, status) {
    if (status === google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response)
      var leg = response.routes[0].legs[0]
      makeMarker(leg.start_location, '/pwa/cabs/cabs/img/icons/PickupPin.png', map);
      makeMarker(leg.end_location, '/pwa/cabs/cabs/img/icons/DropoffPin.png', map);
      directionsDisplay.setMap(map)
    } else {
      console.log('some error occurred')
    }
  })
}

function makeMarker (position, icon, map) {
  new google.maps.Marker({
    position: position,
    map: map,
    icon: icon
  })
}

/**
 * @name  reviewGoogleMaps
 * @params getP2PSearchParams
 * @description The function is used to display the Google maps on the review screen
 */
function reviewGoogleMaps (getP2PSearchParams) {
  let locations = [
    [getP2PSearchParams.pickupLatitude, getP2PSearchParams.pickUpLongitude, '/pwa/cabs/cabs/img/icons/PickupPin.png'],
          [getP2PSearchParams.dropLatitude, getP2PSearchParams.dropLongitude, '/pwa/cabs/cabs/img/icons/DropoffPin.png']
  ]
  let map = new google.maps.Map(document.getElementById('detailsMap'), {
    zoom: 10,
    center: new google.maps.LatLng(getP2PSearchParams.pickupLatitude, getP2PSearchParams.pickUpLongitude),
    disableDefaultUI: true,
    gestureHandling: 'none',
    zoomControl: false,
    mapTypeControl: false,
    clickableIcons: false,
    styles: data.grayStyles
  })
  let infowindow = new google.maps.InfoWindow()
  var marker, i
  for (i = 0; i < locations.length; i++) {
    marker = new google.maps.Marker({
      position: new google.maps.LatLng(locations[i][0], locations[i][1]),
      icon: locations[i][2],
      draggable: false,
      map: map
    })
  }
}
