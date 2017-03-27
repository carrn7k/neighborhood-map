
// Data for Places 
var placeData = {	

	places: [
		{	
			id: 1,
			type: ["food"],
			name: "Moyan",
			info: "A cool little Japanese curry restaurant! The food is awesome and the atmosphere is awesome too!",
			tags: ["curry", "drinks", "delicious"],
			pic: "http://bento.com/rp/500/500-nshinj-moyanome.jpg",
			coordinates: {lat: 35.696275, lng: 139.690556}
		},
		{	
			id: 2,
			type: ["food"],
			name: "Ichiran",
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
			info: "The world's busiest station and hub for travel around Tokyo.",
			tags: ["station", "shopping", "train"],
			pic: "https://1.bp.blogspot.com/-eVWv6ar8LLI/VwJ4Zm4CrxI/AAAAAAAAoyM/IbnSs-Q2yp4-K0rLYvYwDq88mCOPeD0KQ/s1600/koshu-kaido-gate.jpg",
			coordinates: {lat: 35.690788, lng: 139.699600}
		},
		{	
			id: 5,
			type: ["food"],
			name: "Menya",
			info: "A great ramen shop in west Shinjuku. Like Ichiran, it's also popular, so be prepared for a line.",
			tags: ["ramen", "delicious"],
			pic: "http://farm8.staticflickr.com/7384/11326667626_9ee3a4f15f_z.jpg",
			coordinates: {lat: 35.696458, lng: 139.698653}
		},
		{	
			id: 6,
			type: ["sightseeing"],
			name: "Tokyo Metropolitan Government Building",
			info: "A great place to get a view of Tokyo for free.",
			tags: ["view", "skyscraper"],
			pic: "https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Tokyo_Metropolitan_Government_Building_2012.JPG/300px-Tokyo_Metropolitan_Government_Building_2012.JPG",
			coordinates: {lat: 35.690645, lng: 139.692358}
		},
		{	
			id: 7,
			type: ["bar"],
			name: "Shinjuku Goldengai",
			info: "If you like drinking and want a different experience than a typical bar, you should check this place out.",
			tags: ["bar", "drinks", "food"],
			pic: "http://www.tokyoezine.com/wp-content/uploads/2011/03/Golden-Gai.jpg",
			coordinates: {lat: 35.694021, lng: 139.704624}
		},
		{	
			id: 8,
			type: ["shopping", "bar", "sightseeing"],
			name: "Kabukicho",
			info: "Tokyo's red light district. Tons of restaurants and interesting things to do and see.",
			tags: ["shopping", "drinks", "fun"],
			pic: "https://meetrip.to/spotimg/kabukicho_6.jpg",
			coordinates: {lat: 35.6949, lng: 139.7029}
		}			
	],
}


// Object to construct places
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

	// Place Data 
	self.placeList = ko.observableArray([]);
	self.currentArray = ko.observable();

	// Review Info
	self.currentReview = ko.observable('Select a Place to See Reviews!');
	self.reviewUrl = ko.observable();
	self.reviewLink = ko.observable();
	self.tripExpertUrl = ko.observable();
	self.tripExpertLink = ko.observable();
	self.currentYelp = ko.observableArray();
	self.yelpUrl = ko.observable();
	self.yelpLink = ko.observable();

	// DOM elements
	self.dropDown = $('#dropDown');
	self.dropActivate = $('#dropActivate');
	self.dropDownList = $('#dropDownList');
	self.reviewHeaders = $('.review-header');
	self.flickr = $('#flickr');
	self.photoTitle = $('#photo-title');
	self.tripExpertLogo = $("#trip-expert-logo");
	self.yelpLogo = $("#yelp-logo");

	// Filter the array to show only places that match a given 
	// type. The function takes a type as a string and the array
	// of places.
	self.filterArray = function(type, array) {

		// Close all currently open infoWindows while filtering.
		mapHandler.closeAllWindows();

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
						return place.type.indexOf(type) !== -1
				})
			});
			// Hide markers that don't match the type and hide those
			// that don't.
			markers.forEach(function(marker) {
				if (marker.type.indexOf(type) == -1) {
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
	self.displayInfo = function(data) {

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

		// When a list item is clicked, it also triggers calls to 
		// Flickr and Trip Expert API's 
		self.currentYelp([]);
		self.loadReviews(data.name, data.coordinates);

		self.flickr.html('');
		loadFlick(data);
		// self.displayPhotos(data);

	}

	// The current array is initialized to the ko observable array
	// named placeList()
	self.currentArray(self.placeList());

	// Populate the initial list
	placeData.places.forEach(function(place) {
		self.placeList.push(new Place(place));
	})

	self.loadVenue = function(venues, key) {

		var vURL = "https://api.tripexpert.com/v1/venues/" + venues[i].id +
							"?api_key=" + key;

		$.ajax({
			url: vURL,
			type: "GET",
			cache: false,
			success: function(venueData) {

				console.log(venueData);

				self.tripExpertLogo.css("display", "block");

				var review = venueData.response.venues[0].reviews[0].extract;
				var tripPath = venueData.response.venues[0].path;
				var url = venueData.response.venues[0].reviews[0].source_url;
				var source = venueData.response.venues[0].reviews[0].publication_name;

				var tUrl = "https://www.tripexpert.com/" + tripPath;

				self.currentReview(review);
				self.reviewUrl(url);
				self.tripExpertUrl(tUrl)
				self.tripExpertLink("Visit tripExpert for more reviews");
				self.reviewLink("Click Here for Full Review from " + source);
			},
			error: function() {
				console.log("Venue retrieval error");
				self.currentReview("Sorry, something went wrong when fetching your reviews.");
			}
		}); 
	}

	self.loadYelp = function(placeName, coords) {

		var placeData = {'placeName': placeName, 'coords': coords};
		// var placeData = [placeName, coords['lat'], coords['lng']];	
		var placeDataJson = JSON.stringify(placeData);


		self.yelpLink(' ');

		$.ajax({
			url: '/yelpReviews',
			type: 'POST',
			data: placeDataJson,
			contentType: 'application/json;charset=UTF-8',
			dataType: 'json',
			success: function(yelpData) {

				if (yelpData) {

					console.log(yelpData);

					self.yelpLogo.css("display", "block");

					yelpData['reviews']['reviews'].forEach(function(review) {
						self.currentYelp.push(review);
					});

					self.yelpUrl(yelpData['url']);
					self.yelpLink("Visit Yelp for More Info on " + placeName);
				} else {
					self.currentYelp("Sorry, there were no yelp reviews for this place");
				}
			},
			error: function(e) {
				self.currentYelp("Sorry, there was an error fetching your reviews :(")
			}
		})
	}

	self.loadTripExpert = function(placeName, coords) {

		var tripExpertKey = "ec94a7b46ad42d743651578cd86ac4cb"
		var country_id = 25;

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

				var tripExpertReviews = [];
				var yelpReviews = null;
				var venues = data.response.venues;


				// Search through venues in the primary location to return any matches
				// for the desired venue
				var match = false;
				for (i = 0; i < venues.length; i++) {

					console.log(venues[i]['name']);

					// Use the loadVenue function to get the tripExpert info and update
					// the DOM.
					if (placeName.length >= venues[i]['name'].length) {
						matchTest = placeName.toLowerCase();
						searchTest = venues[i]['name'].toLowerCase();
					} else {
						matchTest = venues[i]['name'].toLowerCase();
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
				if (match == false) {
					self.currentReview("Sorry, there are no reviews from Trip Expert for this place yet, but please enjoy the photos!");
					self.reviewUrl('');
					self.reviewLink('');
				}
			},
			error: function() {
				self.currentReview("Sorry, something went wrong when searching for this venue...");
			}
		})
	}

	// This function calls the Yelp and TripExpert API's 
	self.loadReviews = function(placeName, coords) {

		// Display the headings to the reviews
		self.reviewHeaders.css("display", "block");
		self.photoTitle.css("display", "block");

		// Make sure that the previous reviews have been cleared
		self.currentYelp([]);
		self.loadYelp(placeName, coords);

		self.loadTripExpert(placeName, coords);

	}

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
	flickKey + '&per_page=8&format=json&nojsoncallback=1&sort=interestingness-desc' +
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
				console.log("Photos failed to load");
			}
		},
		error: function(e) {
			console.log(e);
			flickrDIV.text("Sorry, there was an error getting your photos :(")
			}
		})
	}
