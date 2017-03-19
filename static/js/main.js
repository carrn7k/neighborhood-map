
// Data for Places 
var placeData = {	

	places: [
		{	
			id: 1,
			type: ["food"],
			name: "Moyan",
			info: "Moyan is a delicious curry restaurant that you have to try!",
			tags: ["curry", "drinks", "delicious"],
			pic: "http://img.timeinc.net/time/photoessays/2009/tokyo/tokyo_shinjuku.jpg",
			coordinates: {lat: 35.696275, lng: 139.690556}
		},
		{	
			id: 2,
			type: ["food"],
			name: "Ichiran",
			info: "This Is Content about Ichiran!",
			tags: ["ramen", "delicious"],
			pic: "http://img.timeinc.net/time/photoessays/2009/tokyo/tokyo_shinjuku.jpg",
			coordinates: {lat: 35.691675, lng: 139.702848}
		},
		{	
			id: 3,
			type: ["sightseeing", "park"],
			name: "Shinjuku Gyoen National Garden",
			info: "This Is Content about Shinjuku Gyoen!",
			tags: ["park", "cherry trees", "garden"],
			pic: "http://img.timeinc.net/time/photoessays/2009/tokyo/tokyo_shinjuku.jpg",
			coordinates: {lat: 35.686301, lng: 139.710095}
		},
		{	
			id: 4,
			type: ["shopping", "station"],
			name: "Shinjuku Station",
			info: "This Is Content about Shinuku Station!",
			tags: ["station", "shopping", "train"],
			pic: "https://1.bp.blogspot.com/-eVWv6ar8LLI/VwJ4Zm4CrxI/AAAAAAAAoyM/IbnSs-Q2yp4-K0rLYvYwDq88mCOPeD0KQ/s1600/koshu-kaido-gate.jpg",
			coordinates: {lat: 35.690788, lng: 139.699600}
		},
		{	
			id: 5,
			type: ["food"],
			name: "Menya",
			info: "This is Content about Menya!",
			tags: ["ramen", "delicious"],
			pic: "http://img.timeinc.net/time/photoessays/2009/tokyo/tokyo_shinjuku.jpg",
			coordinates: {lat: 35.696458, lng: 139.698653}
		},
		{	
			id: 6,
			type: ["sightseeing"],
			name: "Tokyo Metropolitan Government Buildings",
			info: "This Is Content About TMB!",
			tags: ["view", "skyscraper"],
			pic: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Tokyo_Metropolitan_Government_Building_2012.JPG/300px-Tokyo_Metropolitan_Government_Building_2012.JPG",
			coordinates: {lat: 35.690645, lng: 139.692358}
		},
		{	
			id: 7,
			type: ["bar"],
			name: "Shinjuku Golden Gai",
			info: "This Is Content About Shinjuku Golden Gai!",
			tags: ["bar", "drinks", "food"],
			pic: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Tokyo_Metropolitan_Government_Building_2012.JPG/300px-Tokyo_Metropolitan_Government_Building_2012.JPG",
			coordinates: {lat: 35.694021, lng: 139.704624}
		}			
	], 
}


var Place = function(place) {
	this.id = place.id;
	this.type = place.type;
	this.name = place.name;
	this.pic = place.pic;
	this.tags = place.tags;
	this.coordinates = place.coordinates;
}



function PlacesViewModel() {

	var self = this;

	// Data 
	self.placeList = ko.observableArray([]);
	self.currentArray = ko.observable();

	self.currentReview = ko.observable('Click a Place to See Reviews!');
	self.reviewUrl = ko.observable();
	self.reviewLink = ko.observable();

	// DOM elements
	self.dropDown = $('#dropDown');
	self.dropActivate = $('#dropActivate');
	self.dropDownList = $('#dropDownList');
	self.reviewBody = $('#review-body');
	self.flickr = $('#flickr');




	// Filter the array 
	self.filterArray = function(type, array) {

		// Close all currently open infoWindows while filtering
		mapHandler.closeAllWindows();

		// If no specific category is selected, set the array
		// to display all categories
		if (!type) {

			self.currentArray(array.sort());

			markers.forEach(function(marker) {
				marker.setVisible(true);
			});

		} else {
			
			// If a type is passed as an argument, update the 
			// current array to include matching types
			array = ko.computed(function() {
				//console.log(type);
				return ko.utils.arrayFilter(array, function(place) {
						// console.log(place.type);
						// console.log(place.type.indexOf(type));
						return place.type.indexOf(type) !== -1
				})
			});

			// Hide or display the markers that match the 
			// type
			markers.forEach(function(marker) {
				if (marker.type != type) {
					marker.setVisible(false);
				} else {
					marker.setVisible(true);
				}
			});

		// Reset the current array to the filtered array
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

	// Display the infoWindow that is currently selected
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
		mapHandler.closeAllWindows();

		currentInfoWindow.setContent(focusMarker[0].info);
		currentInfoWindow.open(map, focusMarker[0]);

		self.loadTripExpert(data.name);
		self.displayReviews(data);

	}

	// Initially, set currentArray to the 
	// initial list
	self.currentArray(self.placeList());

	// Populate the initial list
	placeData.places.forEach(function(place) {
		self.placeList.push(new Place(place));
	})

	// Display reviews on a marker click
	self.displayReviews = function(data){
		self.flickr.html('');
		loadFlick(data);
	}

	// Trip Expert Reviews
	self.loadTripExpert = function(placeName) {

		var tripExpertKey = "ec94a7b46ad42d743651578cd86ac4cb"
		var country_id = 25;

		var venueURL = "https://api.tripexpert.com/v1/venues?api_key=" + 
			tripExpertKey + "&destination_id=2&order_by=distance&latitude=35.6938" + 
			"&longitude=139.7035";

		// The first ajax call collects a list of venues near the primary location
		$.ajax({
			url: venueURL,
			type: 'GET',

			// Loop through the list of venues and return venue data if it matches
			// the desired place name.
			success: function(data) {

				var reviewData = null;
				var venues = data.response.venues;

				// 
				for (i = 0; i < venues.length; i++) {

					if (venues[i].name == placeName) {

						var vURL = "https://api.tripexpert.com/v1/venues/" + venues[i].id +
							"?api_key=" + tripExpertKey;

						$.ajax({
							url: vURL,
							type: "GET",
							success: function(venueData) {

								var review = venueData.response.venue[0].reviews[0].extract;
								var url = venueData.response.venue[0].reviews[0].source_url;
								var source = venueData.response.venue[0].reviews[0].publication_name;

								self.currentReview(review);
								self.reviewUrl(url);
								self.reviewLink("Click Here for Full Review from " + source);
							},
							error: function() {
								console.log("Venue retrieval error");
							}
						}); 
					} else {
						self.currentReview("Sorry, there are no reviews for this place yet, but please enjoy the photos!");
						self.reviewUrl('');
						self.reviewLink('');
					}
				}
			},
			error: function() {
				console.log("Fuck this shit!");
			}
		})
	}

	// self.disReviews.on("click", self.loadTripExpert());

	// Toggle the DropDown Menu
	self.dropActivate.hover(function() {

		self.dropDownList.css("display", "block");

		self.dropDownList.mouseleave(function() {
			$( this ).css("display", "none");
		})
		self.dropDown.mouseleave(function() {
			self.dropDownList.css("display", "none");
		})

	})

	// 	self.populateVenues();


}

// Create an infoWindow build function which 
// returns a unique infoWindow to push to placeCoords
var MarkersViewModel = {

	self: this,

	// Populate the list markers
	init: function() {

		var self = this; 

		// Populate the empty placeCoords array with sub arrays
		// containing place data 
		placeData.places.forEach(function(place) {
			var infoWindow = self.buildInfoWindow(place.name, place.info, place.pic);
			if (place.coordinates) {
				placeCoords.push([place.coordinates, place.id,
					infoWindow, place.type]);
			};
		});
	},

	// Construct info window content using the name, info and picture data
	// for each place
	buildInfoWindow: function(name, info, pic) {
			var infoTemplate = "<div id='iw-head'><h2>" + name + "<h2></div>" + 
				"<div id='iw-body'><div id='iw-text'>" + info + "</div>" + 
				"<div id='iw-pic'><img src=" + pic + " /></div></div>";
			return infoTemplate
	}
}

ko.applyBindings(new PlacesViewModel());
MarkersViewModel.init();

// SCROLL TEST

var mainBanner = $("#main-banner");
var mapContainer = $("#map-container");
var parallax = $("#plx");

$(document).on("scroll", function() {

	if ($( this ).scrollTop() > 243) {
		mainBanner.css("position", "absolute");
		mainBanner.css("top", 244);
	}
	else {
		mainBanner.css("position", "fixed");
		mainBanner.css("top", 0);
	}

	if ( $( this ).scrollTop() > 265 ) {
		
	}

})


// API'S 


// Flickr API

var flickKey = '308f3dd16dc13ec9851d4e6a6cf7fbaa';
var flickSecret = '5f37e6c3c6b59f51';

/*var lat = 35.690788;
var lon = 139.699600;
var method = 'flickr.photos.search'
var flickURL = 'https://api.flickr.com/services/rest/?method=' + method + 
	'&lat=' + lat + '&lon=' + lon + '&api_key=' +
	flickKey + '&per_page=10&format=json&nojsoncallback=1&sort=relevance' +
	'&radius=3&tags=food,travel,shopping';

var methodFind = 'flickr.places.find'
var placeIDURL = 'https://api.flickr.com/services/rest/?method=' + methodFind + 
	'&api_key=' + flickKey + '&query=Shinjuku%20Station&format=json&nojsoncallback=1';

var methodInfo = 'flickr.places.getInfo'
var methodInfoURL = 'https://api.flickr.com/services/rest/?method=' + methodInfo + 
	'&api_key=' + flickKey + '&place_id=FRthiQZQU7uKHvmP&format=json&nojsoncallback=1';

var methodPopular = 'flickr.places.getPopular'
var methodInfoURL = 'https://api.flickr.com/services/rest/?method=' + methodPopular + 
	'&api_key=' + flickKey + '&place_id=FRthiQZQU7uKHvmP&format=json&nojsoncallback=1'*/ 


function loadFlick(data) {

	var flickrDIV = $("#flickr");
	var method = 'flickr.photos.search';

	var lat = data.coordinates.lat;
	var lon = data.coordinates.lng;
	var tags = data.tags.join();

	var flickURL = 'https://api.flickr.com/services/rest/?method=' + method + 
	'&lat=' + lat + '&lon=' + lon + '&api_key=' +
	flickKey + '&per_page=4&format=json&nojsoncallback=1&sort=relevance' +
	'&radius=1&tags=' + tags;

	$.ajax( {
		url: flickURL,
		type: 'GET',
		success: function(data) {

			if (data['stat'] == 'ok') {

				// update background photo
				var backgroundPhoto = data['photos']['photo'][0];
				var farmID = backgroundPhoto['farm'];
				var serverID = backgroundPhoto['server'];
				var id = backgroundPhoto['id'];
				var secret = backgroundPhoto['secret'];

				var url = "https://farm" + farmID + ".staticflickr.com/" + 
						serverID + "/" + id + "_" + secret + ".jpg";

				$("#dropDown").css("background-image", "url(" + url + ")");

				// display photos
				var photos = data['photos']['photo'];
				photos.forEach(function(photo) { 
					var farmID = photo['farm'];
					var serverID = photo['server'];
					var id = photo['id'];
					var secret = photo['secret'];
					var url = "https://farm" + farmID + ".staticflickr.com/" + 
						serverID + "/" + id + "_" + secret + ".jpg";
					flickrDIV.append($("<img src=" + url + " height='200' width='250'/>"))
				})
			}
			else {
				console.log('Houston, we have a problem');
			}
		},
		error: function(e) {
			console.log(e);
			}

			/*var url = 'https://farm{farm-id}.staticflickr.com/{server-id}/{id}_{secret}.jpg'
			flickrDIV.append("<img src=" + url + "/>")*/
		})
	}

// loadFlick();
// $('#flickButton').on('click', loadFlick());
