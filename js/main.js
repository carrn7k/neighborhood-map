// main js

var placeData = {

	places: [
		{	
			id: 1,
			type: "food",
			name: "Moyan",
			info: "<div><h1>This Is Content about Moyan!</h1></div>",
			coordinates: {lat: 35.696275, lng: 139.690556}
		},
		{	
			id: 2,
			type: "food",
			name: "Ichiran",
			info: "<div><h1>This Is Content about Ichiran!</h1></div>",
			coordinates: {lat: 35.691675, lng: 139.702848}
		},
		{	
			id: 3,
			type: "sightseeing",
			name: "Shinjuku Gyoen",
			info: "<div><h1>This Is Content about Shinjuku Gyoen!</h1></div>",
			coordinates: {lat: 35.686301, lng: 139.710095}
		},
		{	
			id: 4,
			type: "shopping",
			name: "Shinjuku Station",
			info: "<div><h1>This Is Content about Shinuku Station!</h1></div>",
			coordinates: {lat: 35.690788, lng: 139.699600}
		},
		{	
			id: 5,
			type: "food",
			name: "Menya",
			info: "<div><h1>This Is Content about Menya!</h1></div>",
			coordinates: {lat: 35.696458, lng: 139.698653}
		},
		{	
			id: 6,
			type: "sightseeing",
			name: "Tokyo Metropolitan Building",
			info: "<div><h1>This Is Content About TMB!</h1></div>",
			coordinates: {lat: 35.690645, lng: 139.692358}
		}		
	]
}


var Place = function(place) {

	this.id = place.id;
	this.type = place.type;
	this.name = place.name;
	this.coordinates = place.coordinates;

}

function PlacesViewModel() {

	var self = this;

	self.placeList = ko.observableArray([]);
	self.currentArray = ko.observable();

	// Filter the array 
	self.filterArray = function(type, array) {

		closeAllWindows();

		if (!type) {

			self.currentArray(array.sort());

			markers.forEach(function(marker) {
				marker.setVisible(true);
			});

		} else {
			
			array = ko.computed(function() {
				return ko.utils.arrayFilter(array, function(place) {
						return place.type == type;
				})
			});

			// hide or display filtered places
			markers.forEach(function(marker) {
				if (marker.type != type) {
					marker.setVisible(false);
				} else {
					marker.setVisible(true);
				}
			});

		self.currentArray(array());
		};
	}

	// Use the place id from the <li id=""> to retrieve 
	// the corresponding map marker
	self.getCurrentMarker = function(data) {
		var currentMarker = markers.filter(function(marker) {
			return marker.placeID == data.id
		})
		return currentMarker
	}



	self.displayWindow = function(data) {

		var focusMarker = self.getCurrentMarker(data);

		if (focusMarker) {

			// Animate the selected marker. SetTimeout is 
			// used to remove the animation after one bounce
			if (focusMarker[0].getAnimation() !== null) {
				focusMarker[0].setAnimation(null);
			} else {
				focusMarker[0].setAnimation(google.maps.Animation.BOUNCE);
				setTimeout(function() {
					focusMarker[0].setAnimation(null);
				}, 700);
        	};
		};

		// Update the global info window with the current marker
		// content and display the window
		closeAllWindows();

		currentInfoWindow.setContent(focusMarker[0].info);
		currentInfoWindow.open(map, focusMarker[0]);

	}

	// Populate the initial list
	placeData.places.forEach(function(place) {
		self.placeList.push(new Place(place));
	})

	// Initially, set currentArray to the 
	// initial list
	self.currentArray(self.placeList());


}


var MarkersViewModel = {

	// Populate the list markers
	init: function() {

		placeData.places.forEach(function(place) {
			if (place.coordinates) {
				placeCoords.push([place.coordinates, place.id,
					place.info, place.type]);
			};
		});
	}

}

ko.applyBindings(new PlacesViewModel());
MarkersViewModel.init();

// SCROLL TEST

var mainBanner = $("#main-banner");

$(document).on("scroll", function() {
	if ($( this ).scrollTop() > 243) {
		mainBanner.css("position", "absolute");
		mainBanner.css("top", 244);
	}
	else {
		mainBanner.css("position", "fixed");
		mainBanner.css("top", 0);
	}
})


// API'S 