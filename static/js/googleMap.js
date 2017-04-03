// Google Maps

var self = this;

var placeCoords = [],
	markers = [];
	infoWindows = [];
	currentInfoWindow = null;
	bounds = null;

window.initMap = function() {

	var shinjukuCords = {lat: 35.6938, lng: 139.7035};

	var styles = [ {
		featureType: 'transit.line',
		elementType: 'geometry.stroke',
		stylers: [
			{ color: '#061f2b' }
		]
		}, {
		featureType: 'transit.station',
		stylers: [
			{ hue: 'orange' },
			{ weight: 9 }
		]
		}
	];

	map = new google.maps.Map(document.getElementById('map'), {
  		center: shinjukuCords,
  		styles: styles,
  		zoom: 14
	});

	// Create an empty infoWindow on page load
	currentInfoWindow = new google.maps.InfoWindow({ content: null });
	bounds = new google.maps.LatLngBounds();

	mapHandler.buildCoords();

};


// Handles Google Map and Markers
var mapHandler = {

	// Construct Markers and a corresponding info window
	buildCoords: function() {

		// Create a marker for each item in the placeCoords
		// array
		placeCoords.forEach(function(place) {

			var marker = new google.maps.Marker({
				position: place[0],
				placeID: place[1],
				type: place[2],
				animation: google.maps.Animation.DROP,
				map: map,
		});

		// Add an event to open/close an info window 
		// when clicked
		marker.addListener('click', function() {

			// Trigger an Ajax call, defined in the openMarker function,
			// to get a yelp review and photo to display in the infoWindow
			self.vm.openMarker(marker);

		});

		// Set the map boundary to include all markers
		bounds.extend(marker.position);
		markers.push(marker);
		});

		google.maps.event.addDomListener(window, 'resize', function() {
  			map.fitBounds(bounds); 
		});
	},
};


