
// Data for Places 
var placeData = {	

	places: [
		{	
			id: 1,
			type: ["food"],
			name: "Moyan",
			yelpInfo: null,
			info: "A cool little Japanese curry restaurant! The food is awesome and the atmosphere is awesome too!",
			tags: ["curry", "drinks", "delicious"],
			pic: "http://bento.com/rp/500/500-nshinj-moyanome.jpg",
			coordinates: {lat: 35.696275, lng: 139.690556}
		},
		{	
			id: 2,
			type: ["food"],
			name: "Ichiran",
			yelpInfo: null,
			info: "Ichiran is a popular ramen chain. It's delicious, so be prepared for a bit of a line.",
			tags: ["ramen", "delicious"],
			pic: "https://foodsaurus.files.wordpress.com/2014/04/dsc01961.jpg?w=646",
			coordinates: {lat: 35.691675, lng: 139.702848}
		},
		{	
			id: 3,
			type: ["sightseeing", "park"],
			name: "Shinjuku Gyoen National Garden",
			info: "One of Tokyo's best parks. A great place to relax and enjoy the scenery.",
			tags: ["park", "cherry trees", "garden"],
			pic: "http://img.timeinc.net/time/photoessays/2009/tokyo/tokyo_shinjuku.jpg",
			coordinates: {lat: 35.686301, lng: 139.710095}
		},
		{	
			id: 4,
			type: ["shopping", "station"],
			name: "JR Shinjuku Station",
			yelpInfo: null,
			info: "The world's busiest station and hub for travel around Tokyo.",
			tags: ["station", "shopping", "train"],
			pic: "https://1.bp.blogspot.com/-eVWv6ar8LLI/VwJ4Zm4CrxI/AAAAAAAAoyM/IbnSs-Q2yp4-K0rLYvYwDq88mCOPeD0KQ/s1600/koshu-kaido-gate.jpg",
			coordinates: {lat: 35.690788, lng: 139.699600}
		},
		{	
			id: 5,
			type: ["food"],
			name: "Menya",
			yelpInfo: null,
			info: "A great ramen shop in west Shinjuku. Like Ichiran, it's also popular, so be prepared for a line.",
			tags: ["ramen", "delicious"],
			pic: "http://farm8.staticflickr.com/7384/11326667626_9ee3a4f15f_z.jpg",
			coordinates: {lat: 35.696458, lng: 139.698653}
		},
		{	
			id: 6,
			type: ["sightseeing"],
			name: "Tokyo Metropolitan Government Building",
			yelpInfo: null,
			info: "A great place to get a view of Tokyo for free.",
			tags: ["view", "skyscraper"],
			pic: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Tokyo_Metropolitan_Government_Building_2012.JPG/300px-Tokyo_Metropolitan_Government_Building_2012.JPG",
			coordinates: {lat: 35.690645, lng: 139.692358}
		},
		{	
			id: 7,
			type: ["bar"],
			name: "Shinjuku Goldengai",
			yelpInfo: null,
			info: "If you like drinking and want a different experience than a typical bar, you should check this place out.",
			tags: ["bar", "drinks", "food"],
			pic: "http://www.tokyoezine.com/wp-content/uploads/2011/03/Golden-Gai.jpg",
			coordinates: {lat: 35.694021, lng: 139.704624}
		},
		{	
			id: 8,
			type: ["shopping", "bar", "sightseeing"],
			name: "Kabukicho",
			yelpInfo: null,
			info: "Tokyo's red light district. Tons of restaurants and interesting things to do and see.",
			tags: ["shopping", "drinks", "fun"],
			pic: "https://meetrip.to/spotimg/kabukicho_6.jpg",
			coordinates: {lat: 35.6949, lng: 139.7029}
		}			
	],
};


// Object to construct places
var Place = function(place) {
	this.id = place.id;
	this.type = place.type;
	this.name = place.name;
	this.pic = place.pic;
	this.tags = place.tags;
	this.coordinates = place.coordinates;
};


// View model to handle the list and filter for places
function PlacesViewModel() {

	var self = this;
	self.placeData = placeData;

	// Place Data 
	self.placeList = ko.observableArray([]);
	self.currentArray = ko.observable();

	// Flickr Data
	self.flickPhotos = ko.observableArray([]);
	self.showFlick = ko.observable(1);

	// Trip Expert Info
	self.currentExpertReview = ko.observable('Select a Place to See Reviews!');
	self.expertUrl = ko.observable();
	self.expertLink = ko.observable();
	self.tripExpertUrl = ko.observable();
	self.tripExpertLink = ko.observable();

	// Logos
	self.yelpLogo = ko.observable();
	self.tripExpertLogo = ko.observable();

	// Yelp Data
	self.currentYelp = ko.observableArray();
	self.yelpUrl = ko.observable();
	self.yelpLink = ko.observable();

	// DOM elements
	self.dropDown = $('#dropDown');
	self.dropActivate = $('#dropActivate');
	self.dropDownList = $('#dropDownList');
	self.reviewHeaders = $('.review-header');
	self.photoTitle = $('#photo-title');


	// Filter the array to show only places that match a given 
	// type. The function takes a type as a string and the array
	// of places.
	self.filterArray = function(type, array) {

		// Close all currently open infoWindows while filtering.
		// mapHandler.closeAllWindows();
		currentInfoWindow.close();

		// If no specific category is selected, set the current array
		// to display all categories.
		if (!type) {

			self.currentArray(array.sort());

			markers.forEach(function(marker) {
				marker.setVisible(true);
			});

		} else {
			// If a type is passed as an argument, update the 
			// current array to include matching types
			array = ko.computed(function() {
				
				return ko.utils.arrayFilter(array, function(place) {
						return place.type.indexOf(type) !== -1;
				});
			});
			// Hide markers that don't match the type and display those
			// that do.
			markers.forEach(function(marker) {
				if (marker.type.indexOf(type) == -1) {
					marker.setVisible(false);
				} else {
					marker.setVisible(true);
				}
			});

		// Reset the current array to the filtered array
		self.currentArray(array());
		}
	};

	// Use the place id from the <li id=""> to retrieve 
	// the corresponding map marker
	self.getCurrentMarker = function(data) {
		var currentMarker = markers.filter(function(marker) {
			return marker.placeID == data.id;
		});
		return currentMarker;
	};


	// Display the infoWindow that is currently selected
	self.displayInfo = function(data) {

		var focusMarker = self.getCurrentMarker(data);

		// A list click event also triggers a call to openMarker, which
		// populates the infoWindow with an ajax call to Yelp
		self.openMarker(focusMarker[0]);

		// When a list item is clicked, it also triggers calls to 
		// Flickr and Trip Expert API's. The call to loadReviews
		// intitializes these calls.
		self.loadReviews(data);
	};

	// The current array, which is a ko observable is set to contain
	// an observable array which will contain all the places in the 
	// data model
	self.currentArray(self.placeList());
	placeData.places.forEach(function(place) {
		self.placeList.push(new Place(place));
	});

	// The loadYelp function makes a call to a Python server which makes a
	// call to the Yelp Fusion API and returns the data
	self.loadYelp = function(yelpData, placeName) {

		self.yelpLogo('../static/img/Yelp_trademark_RGB_outline.png');

		if (yelpData) {

			yelpData.reviews.reviews.forEach(function(review) {
				self.currentYelp.push(review);
			});

			self.yelpUrl(yelpData.url);
			self.yelpLink("Visit Yelp for More Info on " + placeName);

		} else {
			self.currentYelp(
				{
					"text": "Sorry, there were no yelp reviews for this place",
				 	"url": "#"
			});
		}
	};

	// This function takes a marker, which is passed on a list or marker
	// click event and loads data from yelp to the reviews section and to 
	// the infowindow
	self.openMarker = function(focusMarker) {

		// Clear old data
		currentInfoWindow.close();
		self.flickPhotos([]);
		self.currentYelp([]);
		self.currentExpertReview('');
		self.expertLink('');
		self.tripExpertLink('');

		// Filter out the desired location
		var location = self.placeData.places.filter(function(place) {
					return focusMarker.placeID == place.id;
				});

		// Convert the data to json to pass to the neighborhood.py
		// file for the API request
		var name = location[0].name;
		var coords = location[0].coordinates;
		var placeData = {'placeName': name, 'coords': coords};	
		var placeDataJson = JSON.stringify(placeData);

		if (focusMarker) {

				// Animate the selected marker. SetTimeout is 
				// used to remove the animation after one bounce
				if (focusMarker.getAnimation() !== null) {
					focusMarker.setAnimation(null);
				} else {
					focusMarker.setAnimation(google.maps.Animation.BOUNCE);
					setTimeout(function() {
						focusMarker.setAnimation(null);
					}, 700);
	        	}
			}

		$.ajax({
			url: '/yelpReviews',
			type: 'POST',
			data: placeDataJson,
			contentType: 'application/json;charset=UTF-8',
			dataType: 'json',
			success: function(yelpData) {

				// Build html to populate the infoWindow. If no data is retrieved, display
				// the hardcoded data.
				var info, pic; 
				info = yelpData.reviews.reviews[0].text || self.placeData.places.info;
				pic = yelpData.photo || self.placeData.places.pic;

				var infoTemplate = "<div id='iw-body' class='flex'><div class='col-6' id='iw-text'>" +
					"<img src='../static/img/Yelp_trademark_RGB_outline.png' id='iw-logo' /><p>" +
					info + "</p></div>" + "<div class='col-6' id='iw-pic'><img src=" + pic +
					" /></div></div>";

				// Update the infoWindow
				currentInfoWindow.setContent(infoTemplate);
				currentInfoWindow.open(map, focusMarker);

				// Send yelpData to the loadYelp function to update the view 
				// with the current reviews.
				self.loadYelp(yelpData, name);
			},
			error: function(e) {
				self.currentYelp({
					"text": "Sorry, there was a server side error when fetching Yelp reviews",
				 	"url": "#"});
				console.log(e);
			}
		});
	};

	// The loadVenue function takes a venue and api key and makes an 
	// ajax call to the Trip Expert API to get data on that venue. If 
	// the call fails or returns no data an error message is displayed
	// instead
	self.loadVenue = function(venues, key) {

		var vURL = "https://api.tripexpert.com/v1/venues/" + venues[i].id +
							"?api_key=" + key;

		$.ajax({
			url: vURL,
			type: "GET",
			cache: false,
			success: function(venueData) {

				self.tripExpertLogo('../static/img/basic-logo.png');

				var review, tripPath, url, source, tUrl;

				review = venueData.response.venues[0].reviews[0].extract || 'No Reviews';
				tripPath = venueData.response.venues[0].path || 'No Path Provided';
				url = venueData.response.venues[0].reviews[0].source_url || 'No Url Provided';
				source = venueData.response.venues[0].reviews[0].publication_name || 'No Publication Provided';

				tUrl = (tripPath) ? "https://www.tripexpert.com/" + tripPath : 'No Link for This Review';

				// Variables are updated to display the new venue
				self.currentExpertReview(review);
				self.expertUrl(url);
				self.tripExpertUrl(tUrl);
				self.tripExpertLink("Visit Trip Expert for More Reviews");
				self.expertLink("Click Here for Full Review from " + source);
			},
			error: function(e) {
				console.log(e);
				self.currentExpertReview("Sorry, something went wrong when fetching your reviews.");
			}
		}); 
	};

	// The loadTripExpert begins the retrieval of Trip Expert reviews by 
	// searching through places near the location and, in the event of 
	// a match, calling the loadVenue function to get information on that 
	// specific venue
	self.loadTripExpert = function(placeName, coords) {

		var tripExpertKey = tKey;

		var venueURL = "https://api.tripexpert.com/v1/venues?api_key=" + 
			tripExpertKey + "&destination_id=2&order_by=distance&latitude=" + 
			coords.lat + "&longitude=" + coords.lng;


		// The first ajax call collects a list of venues near the primary location
		$.ajax({
			url: venueURL,
			type: 'GET',
			cache: false,

			// The initial AJAX call narrows the search result to the Shinjuku
			// primary location area
			success: function(data) {

				var venues = data.response.venues;

				// Search through venues in the primary location to return any matches
				// for the desired venue
				var match = false;
				for (i = 0; i < venues.length; i++) {

					// Use the loadVenue function to get the tripExpert info and update
					// the DOM.
					if (placeName.length >= venues[i].name.length) {
						matchTest = placeName.toLowerCase();
						searchTest = venues[i].name.toLowerCase();
					} else {
						matchTest = venues[i].name.toLowerCase();
						searchTest = placeName.toLowerCase();
					}

					var test = matchTest.indexOf('shinjuku'); 

					if (test != -1) {
						searchSplit = searchTest.split(" ");
						searchTest = searchSplit[searchSplit.length -1];
					}

					if (matchTest.includes(searchTest) &&
						searchTest != 'shinjuku') {

						match = true;
						self.loadVenue(venues, tripExpertKey);
						break;
					}
				}
				if (match === false) {
					self.currentExpertReview("Sorry, there are no reviews from Trip Expert for this place yet, but please enjoy the photos!");
					self.expertUrl('');
					self.expertLink('');
					self.tripExpertLink('');
				}
			},
			error: function(e) {
				console.log(e);
				self.currentExpertReview("Sorry, something went wrong when searching for this venue...");
			}
		});
	};

	self.loadFlick = function(data) {

		var flickKey = fKey;
		var flickSecret = fSecret;

		var flickrDIV = $("#flickr");
		var method = 'flickr.photos.search';

		var lat = data.coordinates.lat;
		var lon = data.coordinates.lng;
		var tags = data.tags.join();

		var flickURL = 'https://api.flickr.com/services/rest/?method=' + method + 
		'&lat=' + lat + '&lon=' + lon + '&api_key=' +
		flickKey + '&per_page=8&format=json&nojsoncallback=1&sort=relevance' +
		'&radius=1&tags=' + tags;

		$.ajax( {
			url: flickURL,
			type: 'GET',
			success: function(data) {

				if (data.stat == 'ok') {

					var backgroundPhoto = data.photos.photo[0];
					var farmID = backgroundPhoto.farm;
					var serverID = backgroundPhoto.server;
					var id = backgroundPhoto.id;
					var secret = backgroundPhoto.secret;

					var url = "https://farm" + farmID + ".staticflickr.com/" + 
							serverID + "/" + id + "_" + secret + ".jpg";

					// Display the first, and most relevant, photo 
					// in the filter container
					$("#dropDown").css("background-image", "url(" + url + ")");

					// Populate the div with the images
					var photos = data.photos.photo;
					photos.forEach(function(photo) { 
						var farmID = photo.farm;
						var serverID = photo.server;
						var id = photo.id;
						var secret = photo.secret;
						var url = "https://farm" + farmID + ".staticflickr.com/" + 
							serverID + "/" + id + "_" + secret + ".jpg";

						self.flickPhotos.push({'photo': url});

					});
					self.showFlick(10);
				}
				else {
					self.flickrDIV.text("Sorry, there was an error getting your photos :(");
				}
			},
			error: function(e) {
				console.log(e);
				flickrDIV.text("Sorry, there was an error getting your photos :(");
				}
			});
		};

	self.loadReviews = function(data) {

		// Display the headings to the reviews
		self.reviewHeaders.css("display", "block");
		self.photoTitle.css("display", "block");

		// Trigger Ajax calls to Trip Expert and Flickr
		self.loadTripExpert(data.name, data.coordinates);
		self.loadFlick(data);

	};

	// Toggle the DropDown Menu
	self.dropActivate.hover(function() {

		self.dropDownList.css("display", "block");

		self.dropDownList.mouseleave(function() {
			$( this ).css("display", "none");
		});
		self.dropDown.mouseleave(function() {
			self.dropDownList.css("display", "none");
		});

	});
}


// Create an infoWindow build function which 
// returns a unique infoWindow to push to placeCoords
var MarkersViewModel = {

	self: this,

	// Populate the list markers
	init: function() {

		// Populate the empty placeCoords array with sub arrays
		// containing place data 
		placeData.places.forEach(function(place) {

			// var infoWindow = self.buildInfoWindow(place.name, place.info, place.pic);
			if (place.coordinates) {
				placeCoords.push([place.coordinates, place.id, place.type]);
			}
		});
	},
};

var vm = new PlacesViewModel();
ko.applyBindings(vm);
MarkersViewModel.init();


// Parralax scroll 
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

});

// On the event the Google Maps failes to load, display
// an error message in the map container.
function googleError() {
	var mapContainer = $("#map-container");
	$("#explore-btn").css("display", "none");
	mapContainer.addClass("map-error");
	mapContainer.text("Sorry, Google Maps Failed to load.");
}