function PlacesViewModel(){var e=this;e.placeList=ko.observableArray([]),e.currentArray=ko.observable(),e.currentExpertReview=ko.observable("Select a Place to See Reviews!"),e.expertUrl=ko.observable(),e.expertLink=ko.observable(),e.tripExpertUrl=ko.observable(),e.tripExpertLink=ko.observable(),e.currentYelp=ko.observableArray(),e.yelpUrl=ko.observable(),e.yelpLink=ko.observable(),e.dropDown=$("#dropDown"),e.dropActivate=$("#dropActivate"),e.dropDownList=$("#dropDownList"),e.reviewHeaders=$(".review-header"),e.flickr=$("#flickr"),e.photoTitle=$("#photo-title"),e.tripExpertLogo=$("#trip-expert-logo"),e.yelpLogo=$("#yelp-logo"),e.filterArray=function(o,t){mapHandler.closeAllWindows(),o?(t=ko.computed(function(){return ko.utils.arrayFilter(t,function(e){return e.type.indexOf(o)!==-1})}),markers.forEach(function(e){e.type.indexOf(o)==-1?e.setVisible(!1):e.setVisible(!0)}),e.currentArray(t())):(e.currentArray(t.sort()),markers.forEach(function(e){e.setVisible(!0)}))},e.getCurrentMarker=function(e){return markers.filter(function(o){return o.placeID==e.id})},e.displayInfo=function(o){var t=e.getCurrentMarker(o);t&&(null!==t[0].getAnimation()?t[0].setAnimation(null):(t[0].setAnimation(google.maps.Animation.BOUNCE),setTimeout(function(){t[0].setAnimation(null)},700))),mapHandler.closeAllWindows(),currentInfoWindow.setContent(t[0].info),currentInfoWindow.open(map,t[0]),e.loadReviews(o.name,o.coordinates),e.flickr.html(""),loadFlick(o)},e.currentArray(e.placeList()),placeData.places.forEach(function(o){e.placeList.push(new Place(o))}),e.loadVenue=function(o,t){var n="https://api.tripexpert.com/v1/venues/"+o[i].id+"?api_key="+t;$.ajax({url:n,type:"GET",cache:!1,success:function(o){e.tripExpertLogo.css("display","block");var t=o.response.venues[0].reviews[0].extract,n=o.response.venues[0].path,r=o.response.venues[0].reviews[0].source_url,i=o.response.venues[0].reviews[0].publication_name,a="https://www.tripexpert.com/"+n;e.currentExpertReview(t),e.expertUrl(r),e.tripExpertUrl(a),e.tripExpertLink("Visit Trip Expert for More Reviews"),e.expertLink("Click Here for Full Review from "+i)},error:function(o){console.log(o),e.currentExpertReview("Sorry, something went wrong when fetching your reviews.")}})},e.loadYelp=function(o,t){var n={placeName:o,coords:t},r=JSON.stringify(n);$.ajax({url:"/yelpReviews",type:"POST",data:r,contentType:"application/json;charset=UTF-8",dataType:"json",success:function(t){e.currentYelp([]),e.yelpLink(" "),t?(e.yelpLogo.css("display","block"),t.reviews.reviews.forEach(function(o){e.currentYelp.push(o)}),e.yelpUrl(t.url),e.yelpLink("Visit Yelp for More Info on "+o)):e.currentYelp({text:"Sorry, there were no yelp reviews for this place",url:"#"})},error:function(o){console.log(o),e.currentYelp({text:"Sorry, there were no yelp reviews for this place",url:"#"})}})},e.loadTripExpert=function(o,t){var n=tKey,r="https://api.tripexpert.com/v1/venues?api_key="+n+"&destination_id=2&order_by=distance&latitude="+t.lat+"&longitude="+t.lng;$.ajax({url:r,type:"GET",cache:!1,success:function(t){var r=t.response.venues,a=!1;for(i=0;i<r.length;i++){o.length>=r[i].name.length?(matchTest=o.toLowerCase(),searchTest=r[i].name.toLowerCase()):(matchTest=r[i].name.toLowerCase(),searchTest=o.toLowerCase());if(matchTest.indexOf("shinjuku")!=-1&&(searchSplit=searchTest.split(" "),searchTest=searchSplit[searchSplit.length-1]),matchTest.includes(searchTest)&&"shinjuku"!=searchTest){a=!0,e.loadVenue(r,n);break}}0==a&&(e.currentExpertReview("Sorry, there are no reviews from Trip Expert for this place yet, but please enjoy the photos!"),e.expertUrl(""),e.expertLink(""),e.tripExpertLink(""))},error:function(o){console.log(o),e.currentExpertReview("Sorry, something went wrong when searching for this venue...")}})},e.loadReviews=function(o,t){e.reviewHeaders.css("display","block"),e.photoTitle.css("display","block"),e.loadYelp(o,t),e.loadTripExpert(o,t)},e.dropActivate.hover(function(){e.dropDownList.css("display","block"),e.dropDownList.mouseleave(function(){$(this).css("display","none")}),e.dropDown.mouseleave(function(){e.dropDownList.css("display","none")})})}function loadFlick(e){var o=$("#flickr"),t=e.coordinates.lat,n=e.coordinates.lng,r=e.tags.join(),i="https://api.flickr.com/services/rest/?method=flickr.photos.search&lat="+t+"&lon="+n+"&api_key="+flickKey+"&per_page=8&format=json&nojsoncallback=1&sort=relevance&radius=1&tags="+r;$.ajax({url:i,type:"GET",success:function(e){if("ok"==e.stat){var t=e.photos.photo[0],n=t.farm,r=t.server,i=t.id,a=t.secret,s="https://farm"+n+".staticflickr.com/"+r+"/"+i+"_"+a+".jpg";$("#dropDown").css("background-image","url("+s+")");e.photos.photo.forEach(function(e){var t=e.farm,n=e.server,r=e.id,i=e.secret,a="https://farm"+t+".staticflickr.com/"+n+"/"+r+"_"+i+".jpg";o.append($("<img src="+a+" height='200' width='250'/>"))})}else self.flickrDIV.text("Sorry, there was an error getting your photos :(")},error:function(e){console.log(e),o.text("Sorry, there was an error getting your photos :(")}})}var fKey="308f3dd16dc13ec9851d4e6a6cf7fbaa",fSecret="5f37e6c3c6b59f51",tKey="ec94a7b46ad42d743651578cd86ac4cb",placeCoords=[],markers=[];infoWindows=[],currentInfoWindow=null,bounds=null,window.initMap=function(){var e={lat:35.6938,lng:139.7035},o=[{featureType:"transit.line",elementType:"geometry.stroke",stylers:[{color:"#061f2b"}]},{featureType:"transit.station",stylers:[{hue:"orange"},{weight:9}]}];map=new google.maps.Map(document.getElementById("map"),{center:e,styles:o,zoom:7}),currentInfoWindow=new google.maps.InfoWindow({content:null}),bounds=new google.maps.LatLngBounds,mapHandler.buildCoords()};var mapHandler={buildCoords:function(){var e=this;placeCoords.forEach(function(o){var t=new google.maps.Marker({position:o[0],placeID:o[1],info:o[2],type:o[3],animation:google.maps.Animation.DROP,map:map}),n=new google.maps.InfoWindow({content:o[2]});t.addListener("click",function(){e.closeAllWindows(),n.open(map,t)}),bounds.extend(t.position),infoWindows.push(n),markers.push(t)}),map.fitBounds(bounds)},closeAllWindows:function(){for(i=0;i<infoWindows.length;i++)infoWindows[i].close();currentInfoWindow&&currentInfoWindow.close()}},placeData={places:[{id:1,type:["food"],name:"Moyan",info:"A cool little Japanese curry restaurant! The food is awesome and the atmosphere is awesome too!",tags:["curry","drinks","delicious"],pic:"http://bento.com/rp/500/500-nshinj-moyanome.jpg",coordinates:{lat:35.696275,lng:139.690556}},{id:2,type:["food"],name:"Ichiran",info:"Ichiran is a popular ramen chain. It's delicious, so be prepared for a bit of a line.",tags:["ramen","delicious"],pic:"https://foodsaurus.files.wordpress.com/2014/04/dsc01961.jpg?w=646",coordinates:{lat:35.691675,lng:139.702848}},{id:3,type:["sightseeing","park"],name:"Shinjuku Gyoen National Garden",info:"One of Tokyo's best parks. A great place to relax and enjoy the scenery.",tags:["park","cherry trees","garden"],pic:"http://img.timeinc.net/time/photoessays/2009/tokyo/tokyo_shinjuku.jpg",coordinates:{lat:35.686301,lng:139.710095}},{id:4,type:["shopping","station"],name:"JR Shinjuku Station",info:"The world's busiest station and hub for travel around Tokyo.",tags:["station","shopping","train"],pic:"https://1.bp.blogspot.com/-eVWv6ar8LLI/VwJ4Zm4CrxI/AAAAAAAAoyM/IbnSs-Q2yp4-K0rLYvYwDq88mCOPeD0KQ/s1600/koshu-kaido-gate.jpg",coordinates:{lat:35.690788,lng:139.6996}},{id:5,type:["food"],name:"Menya",info:"A great ramen shop in west Shinjuku. Like Ichiran, it's also popular, so be prepared for a line.",tags:["ramen","delicious"],pic:"http://farm8.staticflickr.com/7384/11326667626_9ee3a4f15f_z.jpg",coordinates:{lat:35.696458,lng:139.698653}},{id:6,type:["sightseeing"],name:"Tokyo Metropolitan Government Building",info:"A great place to get a view of Tokyo for free.",tags:["view","skyscraper"],pic:"https://upload.wikimedia.org/wikipedia/commons/thumb/5/5e/Tokyo_Metropolitan_Government_Building_2012.JPG/300px-Tokyo_Metropolitan_Government_Building_2012.JPG",coordinates:{lat:35.690645,lng:139.692358}},{id:7,type:["bar"],name:"Shinjuku Goldengai",info:"If you like drinking and want a different experience than a typical bar, you should check this place out.",tags:["bar","drinks","food"],pic:"http://www.tokyoezine.com/wp-content/uploads/2011/03/Golden-Gai.jpg",coordinates:{lat:35.694021,lng:139.704624}},{id:8,type:["shopping","bar","sightseeing"],name:"Kabukicho",info:"Tokyo's red light district. Tons of restaurants and interesting things to do and see.",tags:["shopping","drinks","fun"],pic:"https://meetrip.to/spotimg/kabukicho_6.jpg",coordinates:{lat:35.6949,lng:139.7029}}]},Place=function(e){this.id=e.id,this.type=e.type,this.name=e.name,this.pic=e.pic,this.tags=e.tags,this.coordinates=e.coordinates},MarkersViewModel={self:this,init:function(){var e=this;placeData.places.forEach(function(o){var t=e.buildInfoWindow(o.name,o.info,o.pic);o.coordinates&&placeCoords.push([o.coordinates,o.id,t,o.type])})},buildInfoWindow:function(e,o,t){return"<div id='iw-head'><h2>"+e+"<h2></div><div id='iw-body'><div id='iw-text'>"+o+"</div><div id='iw-pic'><img src="+t+" /></div></div>"}};ko.applyBindings(new PlacesViewModel),MarkersViewModel.init();var mainBanner=$("#main-banner"),mapContainer=$("#map-container"),parallax=$("#plx");$(document).on("scroll",function(){$(this).scrollTop()>243?(mainBanner.css("position","absolute"),mainBanner.css("top",244)):(mainBanner.css("position","fixed"),mainBanner.css("top",0)),$(this).scrollTop()});var flickKey=fKey,flickSecret=fSecret;