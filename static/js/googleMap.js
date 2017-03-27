// Google Maps 

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
	]

	map = new google.maps.Map(document.getElementById('map'), {
  		center: shinjukuCords,
  		styles: styles,
  		zoom: 7
	});

	// Create an empty infoWindow on page load
	currentInfoWindow = new google.maps.InfoWindow({ content: null });
	bounds = new google.maps.LatLngBounds();

	mapHandler.buildCoords();

}


// Handles Google Map and Markers
var mapHandler = {

	// Construct Markers and a corresponding info window
	buildCoords: function() {
		var self = this;

		// Create a marker for each item in the placeCoords
		// array
		placeCoords.forEach(function(place) {
		var marker = new google.maps.Marker({
			position: place[0],
			placeID: place[1],
			info: place[2],
			type: place[3],
			animation: google.maps.Animation.DROP,
			map: map,
		})

		// Build the corresponding info window
		var infowindow = new google.maps.InfoWindow({
	      content: place[2]
	    });

		// Add an event to open/close an info window 
		// when clicked
		marker.addListener('click', function() {
			// Close any open info window upon click
			self.closeAllWindows();
			infowindow.open(map, marker);
		});

		// Set the map boundary to include all markers
		bounds.extend(marker.position);

		infoWindows.push(infowindow);
		markers.push(marker);
		})

		map.fitBounds(bounds);

	},
	
	closeAllWindows: function() {
		for (i = 0; i < infoWindows.length; i++) 
			infoWindows[i].close();
		if (currentInfoWindow) 
			currentInfoWindow.close()
	}
}

