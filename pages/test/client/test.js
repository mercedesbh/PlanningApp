//
// if (Meteor.isClient) {
//   Meteor.startup(function() {
//     GoogleMaps.load({ v: '3', key: 'AIzaSyBjJkcSNWBO1LHLusupVT4bSMXUgwV1w3M', libraries: 'places' });
//   });
// }
//
// Template.test.onRendered(function() {
//   GoogleMaps.load({ v: '3', key: 'AIzaSyBjJkcSNWBO1LHLusupVT4bSMXUgwV1w3M', libraries: 'places' });
//
//   var lat;
//   var lng;
//   window.onload = function() {
//     var latlng;
//     if (navigator.geolocation) {
//         navigator.geolocation.getCurrentPosition(function(position) {
//           var pos = {
//             lat: position.coords.latitude,
//             lng: position.coords.longitude
//           };
//           lat = pos.lat;
//           lng = pos.lng;
//           latlng = new google.maps.LatLng(pos.lat, pos.lng);
//
//           //Set start field to current location
//           document.getElementById('start').defaultValue = lat +", " +lng;
//
//         });
//     } else {
//            latlng = new google.maps.LatLng(42.358970, -71.066093);
//     }
//         var input = document.getElementById('end');
//         var autocomplete = new google.maps.places.Autocomplete(input);
//
//         // When the user selects an address from the dropdown,
//         google.maps.event.addListener(autocomplete, 'place_changed', function() {
//
//              // Get the place details from the autocomplete object.
//              var place = autocomplete.getPlace();
//
//
//             //  console.log("place: " + JSON.stringify(place) );
//         });
//     };
// });
//
// Template.test.helpers({
//   exampleMapOptions: function() {
//     // Make sure the maps API has loaded
//     if (GoogleMaps.loaded()) {
//       // Map initialization options
//       var latlng = new google.maps.LatLng(42.358970, -71.066093);
//       var mapOptions = {
//         zoom: 10,
//         center: latlng,
//         mapTypeId: google.maps.MapTypeId.ROADMAP
//       };
//       return mapOptions;
//     }
//   }
// });
//
//
// Template.test.onCreated(function() {
//   // We can use the `ready` callback to interact with the map API once the map is ready.
//   GoogleMaps.ready('initMap', function(map) {
//     // Add a marker to the map once it's ready
//     // var marker = new google.maps.Marker({
//     //   position: map.options.center,
//     //   map: map.instance
//     // });
//   });
// });
//
//
// Template.test.events({
//     "click .js-submit-location": function(event) {
//       event.preventDefault();
//       const origin = $(".js-start").val();
//       const destination = $(".js-end").val();
//       console.log(origin);
//       console.log(destination);
//       calculateRoute(origin, destination);
//     }
// });
//
// function calculateRoute(origin, destination) {
//         var directionsService = new google.maps.DirectionsService();
//         var directionsRequest = {
//           origin: origin,
//           destination: destination,
//           travelMode: google.maps.DirectionsTravelMode.DRIVING,
//         };
//         console.log("sending request");
//         // console.dir(directionsRequest);
//         directionsService.route(
//           directionsRequest,
//           function(response, status)
//           { console.dir([status,response]);
//             if (status == google.maps.DirectionsStatus.OK)
//             {
//               console.log("routing");
//               new google.maps.DirectionsRenderer({
//                 map: GoogleMaps.maps.initMap.instance,
//                 directions: response
//               });
//               getLatlong();
//               console.log("complete");
//             }
//             else
//               $("#error").append("Unable to retrieve your route<br />");
//           }
//         );
//
//       }
//   function getLatlong(){
//       var geocoder = new google.maps.Geocoder();
//       var address = document.getElementById('end').value;
//
//       geocoder.geocode({ 'address': address }, function (results, status) {
//
//           if (status == google.maps.GeocoderStatus.OK) {
//               var latitude = results[0].geometry.location.lat();
//               var longitude = results[0].geometry.location.lng();
//               console.log([latitude, longitude]);
//
//           }
//       });
//
// }
//
//
//       $(document).ready(function() {
//
//         $("#from-link, #to-link").click(function(event) {
//           event.preventDefault();
//           var addressId = this.id.substring(0, this.id.indexOf("-"));
//           navigator.geolocation.getCurrentPosition(function(position) {
//             var geocoder = new google.maps.Geocoder();
//             geocoder.geocode({
//               "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
//             },
//             function(results, status) {
//               if (status == google.maps.GeocoderStatus.OK)
//                 $("#" + addressId).val(results[0].formatted_address);
//               else
//                 $("#error").append("Unable to retrieve your address<br />");
//             });
//           },
//           function(positionError){
//             $("#error").append("Error: " + positionError.message + "<br />");
//           },
//           {
//             enableHighAccuracy: true,
//             timeout: 10 * 1000 // 10 seconds
//           });
//         });
//
//         $("#calculate-route").submit(function(event) {
//           event.preventDefault();
//           calculateRoute($("#from").val(), $("#to").val());
//         });
//       });
