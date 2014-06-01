$(function() {
    App = Ember.Application.create(); //Creates the ember application
  
    //Create the router to handle navigating through the URL
    App.Router.map(function(){
        this.resource('map');
    });
    
    //Create the View to display your content
    App.MapView = Ember.View.extend({
        didInsertElement: function (){
        
            //////////
            //1. CREATE THE MAP and insert it into the HTML div to display in the browser using given options
            /////////
            var mapOptions = {
              zoom: 11, //Defines the zoom level of your map to start
              mapTypeId: google.maps.MapTypeId.ROADMAP //Defines the type of map. Can also use: SATELLITE, HYBRID, TERRAIN
            };
            var map = new google.maps.Map(document.getElementById('map_canvas'), mapOptions);
            this.set('map');
            
            //////////
            //2. GEOLOCATION:
            /////////
            if(navigation.geolocation) {
                navigator.geolocation.getCurrentPosition(function(position){
                    var pos = new google.maps.LatLng(position.coords.latitude, position.coords.longitude); //Gets current location
                    map.setCenter(pos); //Sets the center of the map to current location
                    
                    //////////
                    //3. SET MARKER to currentlocation
                    //////////
                    var center_marker = new google.maps.Marker({
                        position: pos, //Required - sets marker position
                        map: map, //Required - tells which map to set to
                        title: 'Current Location', //Optional - Adds info title to marker when mouse hovers over it
                        icon: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png' //Optional - can choose icon appearance. Red is default
                    });
                    
                    ///////////
                    //4. SEARCH for nearby places
                    ///////////
                    var request = {
                        location: pos, //Required - sets location to search around
                        radius: 1500, //Required - tells radius to search within from above position
                        types: ['bar'] //Optional - defines what type of places to search for. Complete list can be found at https://developers.google.com/places/documentation/supported_types
                    };
                    var service = new google.maps.places.PlacesService(map);
                    
                    service.nearbySearch(request,function(results,status){
                        if(status == google.maps.places.PlacesServiceStatus.OK){ //Used to make sure that geolocation is supported by browser
                            var positions = []; //Will store latitude,longitude values for all search results here
                            var alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
                    
                            for (var i = 0; i < results.length; i++) {
                                var place = results[i];
                                var pos = new google.maps.LatLng(place.geometry.location.lat(), place.geometry.location.lng());
                    
                                positions.pushObject(pos); //Puts the lat,long objects into the positions array
                            };
                        
                            ///////////
                            //5. ALPHABETIC MARKERS drops multiple pins marking all nearby locations with an alphabetic marker
                            ///////////
                            for(var i=0; i<positions.length;i++){
                                var letter = alphabet.charAt(i);
                    
                                var marker = new google.maps.Marker({
                                    position: positions[i],
                                    map:map,
                                    title: 'pin' + i,
                                    icon:'http://www.google.com/mapfiles/marker' + letter + '.png' //Uses googlemap icon with alphabetic symbol
                                });
                            };
                        }
                    });
                }, 
                //Callback funcition if the geolocation fails
                function() {
                    handleNoGeolocation(true);
                });
            } 
            //Logic for situation where geolocation is not supported on browser
            else {
                handleNoGeolocation(false);
            }
        }
    });
    
    //function to handle different scenarios where no geolocation occurs 
    function handleNoGeolocation(errorFlag) {
        if(errorFlag) {
                var content = "Error: The Geolocation Service Failed."
            } else {
                var content = "Error: Your Browser does not support Geolocation"
            }
    
            var options = {
                map: map,
                position: new google.maps.LatLng(40,-111),
            };
    
            map.setCenter(options.position);
    }
})
