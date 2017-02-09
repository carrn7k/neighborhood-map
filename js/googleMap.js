// Google Maps 

var placeCoords = [],
	markers = [];
	infoWindows = [];
	currentInfoWindow = null

function initMap() {

	var shinjukuCords = {lat: 35.6938, lng: 139.7035};

	map = new google.maps.Map(document.getElementById('map'), {
  		center: shinjukuCords,
  		zoom: 8
	});

	placeCoords.forEach(function(place) {
		var marker = new google.maps.Marker({
			position: place[0],
			placeID: place[1],
			info: place[2],
			animation: google.maps.Animation.DROP,
			map: map,
		})

		var infowindow = new google.maps.InfoWindow({
          content: place[2]
        });

		marker.addListener('click', function() {
			// close all other info windows 
			closeAllWindows();
			infowindow.open(map, marker);
		});

		infoWindows.push(infowindow);
		markers.push(marker);
	})

	currentInfoWindow = new google.maps.InfoWindow({ content: null });

}

function closeAllWindows() {

	for (i = 0; i < infoWindows.length; i++) 
		infoWindows[i].close();

	if (currentInfoWindow) 
		currentInfoWindow.close()

}






window.onload = function() {
	
	document.addEventListener("scroll", function() {
		// something here
	})
}
