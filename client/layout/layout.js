Deps.autorun(function() {
    Meteor.subscribe("theUsers");
});
Meteor.subscribe("theTasks");
Meteor.subscribe("theGoals");
Meteor.subscribe("theTexts");
Meteor.subscribe("theCategories");

if (Meteor.isClient) {
  Meteor.startup(function() {
    GoogleMaps.load({ v: '3', key: 'AIzaSyBjJkcSNWBO1LHLusupVT4bSMXUgwV1w3M', libraries: 'places' });

  });
}

Template.layout.helpers({
    userName: function() {
        const liveUser = Meteor.userId();
        return Meteor.users.findOne({
            _id: liveUser
        });
    },
    highlight: function(template) {
      var currentRoute = Router.current().route.getName();
      return currentRoute && template === currentRoute ? 'css-side-nav-highlight' : '';
    },
});

Template.layout.events({
    "click #mapTrigger": function(event) {
      console.log("what is this for?");
    },
    "click .js-logout": function(event) {
        event.preventDefault();

        Meteor.logout();
    },
});

Template.modal.helpers({
    taskChosen: function() {
        return Template.instance().taskChosen.get();
    },
    goalChosen: function() {
        return Template.instance().goalChosen.get();
    },
    textChosen: function() {
        return Template.instance().textChosen.get();
    },
    map: function() {
        return Template.instance().map.get();
    },
    selectCategory: function() {
        const user = Meteor.users.findOne(Meteor.userId());
        return user.categories
    },
    tags: function() {
      return Meteor.users.find({_id: Meteor.userId()}).fetch()[0].categories[0].tags;
    },

    //Map helpers
    exampleMapOptions: function() {
      // Make sure the maps API has loaded
      if (GoogleMaps.loaded()) {
        // Map initialization options
        var latlng = new google.maps.LatLng(42.358970, -71.066093);
        var mapOptions = {
          zoom: 10,
          center: latlng,
          mapTypeId: google.maps.MapTypeId.ROADMAP
        };
        return mapOptions;
      }
    },
});

Template.modal.events({
    "change .js-modal-select": function(event, template) {
        if ($(event.target).val() == "task") {
            template.taskChosen.set(true);
            template.goalChosen.set(false);
            template.textChosen.set(false);
        } else if ($(event.target).val() == "goal") {
            template.taskChosen.set(false);
            template.goalChosen.set(true);
            template.textChosen.set(false);
        } else if ($(event.target).val() == "text") {
            template.taskChosen.set(false);
            template.goalChosen.set(false);
            template.textChosen.set(true);
        }
    },
    "keypress .js-task-destination": function(event, template){
      template.map.set(true);
    },
    "blur .js-task-destination": function(event, template){
      if ($(".js-task-destination").val() == 0){
        template.map.set(false);
      }
    },
    "click .js-add-entry": function(event) {
        event.preventDefault();

        if ($(".js-modal-select").val() == "task") {

            const tTitle = $(".js-task-title").val();
            var tTime = $(".js-task-date").val();
            var tDate = $(".js-task-date").val();
            var tLocation = $(".js-task-destination").val();
            var tNote = $(".js-task-note").val();
            const tPriority = $(".js-select-task-priority").val();
            const tCategory = $(".js-select-category").val();
            var tTag = $(".js-select-task-tag").val();
            var tTagName = $(".js-new-tag-name").val();

            if (tTag && tTagName) {
                alert("Create new tag or use existing one?");
                return;
            } else if (tTagName != null || tTagName.length > 0) {
                tTag = tTagName;
            }

            if (tTag.length > 0) {
              var tTagColor = intToRGB(hashCode(tTag));
            }

            tTime = moment(tTime).format('h:mm A');
            tDate = moment(tDate).format('MMM Do YY');

            if (tLocation == "") {
                tLocation = null;
            }
            if (tNote == "") {
                tNote = null;
            }

            const newTask = {
                task: "task",
                title: tTitle,
                date: tDate,
                category: tCategory,
                time: tTime,
                location: tLocation,
                note: tNote,
                createdAt: new Date(),
                createdBy: Meteor.userId(),
                modified: new Date(),
                completed: false,
                tag: tTag,
                tagColor: tTagColor,
                priority: tPriority
                // isGoal: ???
                // reminder: ???
                // repeat: ???
            }

            const tTagObj = {
                tagName: tTag,
                tagColor: tTagColor
            }

            Meteor.call("createTask", newTask,function(error, result) {
              if (error) {
                console.log(error);
              }
              else {
                var lastEntry = Tasks.findOne({}, {sort: {createdAt: -1, limit: 1}})._id;
                Meteor.call("linkTask", lastEntry, tCategory);
                if (tTag.length > 0) {
                  Meteor.call("linkTag", tCategory, tTagObj);
                }

                // console.log("Did it work?");
                $(".js-task-title").val("");
                $(".js-task-date").val("");
                $(".js-task-destination").val("");
                $(".js-task-note").val("");
                console.log("reloading");
                var map = GoogleMaps.maps.initMap.instance;
                var center = map.getCenter();
                   google.maps.event.trigger(map, 'resize');
                   map.setCenter(center)
                // });
                console.log("complete");

              }
            });

        } else if ($(".js-modal-select").val() == "goal") {

            const gTitle = $(".js-goal-title").val();
            const gDateS = $(".js-goal-date-s").val();
            const gDateF = $(".js-goal-date-f").val();
            const gPriority = $(".js-select-goal-priority").val();
            var gNote = $(".js-goal-note").val();
            const gCategory = $(".js-select-category").val();
            var gTag = $(".js-select-goal-tag").val();
            var gTagName = $(".js-new-tag-name").val();

            gDateST = moment(gDateS).format('h:mm A');
            gDateSD = moment(gDateS).format('MMM Do YY');

            gDateFT = moment(gDateF).format('h:mm A');
            gDateFD = moment(gDateF).format('MMM Do YY');

            if (gTag && gTagName) {
                alert("Create new tag or use existing one?");
                return;
            } else if (gTagName != null || gTagName.length > 0) {
                gTag = gTagName;
            }

            if (gTag.length > 0) {
              var gTagColor = intToRGB(hashCode(gTag));
            }

            if (gNote == "") {
                gNote = null;
            }

            const newGoal = {
                goal: "goal",
                title: gTitle,
                category: gCategory,
                date: gDateSD,
                time: gDateST,
                finish_date: gDateFD,
                finish_time: gDateFT,
                note: gNote,
                createdAt: new Date(),
                createdBy: Meteor.userId(),
                modified: new Date(),
                completed: false,
                tasks: [],
                priority: gPriority,
                tag: gTag,
                tagColor: gTagColor
                // isGoal: ???
                // reminder: ???
                // repeat: ???
            }

            const gTagObj = {
                tagName: gTag,
                tagColor: gTagColor
            }

            Meteor.call("createGoal", newGoal, function(error, result) {
              if (error) {
                console.log(error);
              }
              else {
                var lastEntry = Goals.findOne({}, {sort: {createdAt: -1, limit: 1}})._id;
                Meteor.call("linkGoal", lastEntry, gCategory);
                if (gTag.length > 0) {
                  Meteor.call("linkTag", gCategory, gTagObj);
                }

                // console.log("Did it work?");
                $(".js-goal-title").val("");
                $(".js-goal-date-s").val("");
                $(".js-goal-date-f").val("");
                $(".js-goal-note").val("");
              }

          });
        } else if ($(".js-modal-select").val() == "text") {

            const txtTitle = $(".js-text-title").val();
            const txtText = $(".js-text-text").val();
            const txtCategory = $(".js-select-category").val();
            var txtTag = $(".js-select-text-tag").val();
            var txtTagName = $(".js-new-tag-name").val();

            if (txtTag && txtTagName) {
                alert("Create new tag or use existing one?");
                return;
            } else if (txtTagName != null || txtTagName.length > 0) {
                txtTag = txtTagName;
            }

            if (txtTag.length > 0) {
              var txtTagColor = intToRGB(hashCode(txtTag));
            }

            const newText = {
                text: "text",
                title: txtTitle,
                category: txtCategory,
                text: txtText,
                createdAt: new Date(),
                createdBy: Meteor.userId(),
                modified_time: moment(new Date()).format('h:mm A'),
                modified_date: moment(new Date()).format('MMM Do YY'),
                // reminder: ???
                // notes [???]
            }

            const txtTagObj = {
                tagName: txtTag,
                tagColor: txtTagColor
            }

            Meteor.call("createText", newText, function(error, result) {
              if (error) {
                console.log(error);
              }
              else {
                var lastEntry = Texts.findOne({}, {sort: {createdAt: -1, limit: 1}})._id;
                Meteor.call("linkText", lastEntry, txtCategory);
                if (txtTag.length > 0) {
                  Meteor.call("linkTag", txtCategory, txtTagObj);
                }

                $(".js-text-title").val("");
                $(".js-text-text").val("");
              }

          });

        }
        $('.modal').modal('hide');
        location.reload();
    },
    "click .js-submit-location": function(event) {
        event.preventDefault();
        const origin = $(".js-task-origin").val();
        const destination = $(".js-task-destination").val();
        console.log(origin);
        console.log(destination);
        calculateRoute(origin, destination);
    }
});


Template.modal.onCreated(function() {
    this.taskChosen = new ReactiveVar(true);
    this.goalChosen = new ReactiveVar(false);
    this.textChosen = new ReactiveVar(false);
    this.map = new ReactiveVar(false);
    // Map onCreated
    // We can use the `ready` callback to interact with the map API once the map is ready.
    GoogleMaps.ready('initMap', function(map) {
        // Add a marker to the map once it's ready
        // var marker = new google.maps.Marker({
        //   position: map.options.center,
        //   map: map.instance
        // });
    });
});

Template.modal.onRendered(function() {
    this.$('.datetimepicker5').datetimepicker();
    this.$('.datetimepicker6').datetimepicker();

    // Map onRendered
    GoogleMaps.load({
        v: '3',
        key: 'AIzaSyBjJkcSNWBO1LHLusupVT4bSMXUgwV1w3M',
        libraries: 'places'
    });

    var lat;
    var lng;
    window.onload = function() {

      var latlng;
      if (navigator.geolocation) {
          navigator.geolocation.getCurrentPosition(function(position) {
            var pos = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            lat = pos.lat;
            lng = pos.lng;
            latlng = new google.maps.LatLng(pos.lat, pos.lng);

            //Set start field to current location
            document.getElementById('start').defaultValue = lat +", " +lng;

            var map = GoogleMaps.maps.initMap.instance;
            console.log("clicked");
            var center = map.getCenter();
              console.log("map loaded with geolocation");
               google.maps.event.trigger(map, 'resize');
               map.setCenter(center);
          });
          var input = document.getElementById('end');
          var autocomplete = new google.maps.places.Autocomplete(input);

        // When the user selects an address from the dropdown,
        google.maps.event.addListener(autocomplete, 'place_changed', function() {

            // Get the place details from the autocomplete object.
            var place = autocomplete.getPlace();
          });
      } else {
            //  latlng = new google.maps.LatLng(42.358970, -71.066093);
      }
      return {
              zoom: 10,
              center: latlng,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };

      };
});

//************* MAP CALCULATE ROUTE ***************//
function calculateRoute(origin, destination) {
        var directionsService = new google.maps.DirectionsService();
        var directionsRequest = {
          origin: origin,
          destination: destination,
          travelMode: google.maps.DirectionsTravelMode.DRIVING,
        };
        console.log("sending request");
        console.dir(directionsRequest);
        directionsService.route(
          directionsRequest,
          function(response, status)
          { console.dir([status,response, new Date()]);
            if (status == google.maps.DirectionsStatus.OK)
            {
              console.log("routing");
              new google.maps.DirectionsRenderer({
                map: GoogleMaps.maps.initMap.instance,
                directions: response
              });
              getLatlong();
              calculateDistanceDuration(origin, destination);


              console.log("complete");
            }
            else
              $("#error").append("Unable to retrieve your route<br />");
          }
        );
      }

      //************* MAP DESTINATION COORDINATES ***************//
      function getLatlong(){
          var geocoder = new google.maps.Geocoder();
          var address = document.getElementById('end').value;
          geocoder.geocode({ 'address': address }, function (results, status) {
              if (status == google.maps.GeocoderStatus.OK) {
                const coordinates = {
                    address: address,
                    lat: results[0].geometry.location.lat(),
                    lng: results[0].geometry.location.lng()
                  }
                  // console.log([newLocation.lat, newLocation.lng]);
                  // console.log(coordinates);
                  Meteor.call("saveCoor", coordinates);
                }

              }
        );

      }

      //************* MAP DISTANCE AND DURATION ***************//
      function calculateDistanceDuration(origin, destination) {
      var service = new google.maps.DistanceMatrixService();
          service.getDistanceMatrix({
              origins: [origin],
              destinations: [destination],
              travelMode: google.maps.TravelMode.DRIVING,
              unitSystem: google.maps.UnitSystem.METRIC,
              avoidHighways: false,
              avoidTolls: false
          }, function (response, status) {
              if (status == google.maps.DistanceMatrixStatus.OK && response.rows[0].elements[0].status != "ZERO_RESULTS") {
                  var distance = response.rows[0].elements[0].distance.text;
                  var duration = response.rows[0].elements[0].duration.text;
                  var dvDistance = document.getElementById("dvDistance");
                 dvDistance.innerHTML = "";
                  dvDistance.innerHTML += "Distance: " + distance + "<br />";
                  dvDistance.innerHTML += "Duration:" + duration;
                  console.log("Distance: " + distance);
                  console.log("Duration:" + duration);
              } else {
                  alert("Unable to find the distance via road.");
              }
          });
        }


        $("#calculate-route").submit(function(event) {
          event.preventDefault();
          calculateRoute($("#from").val(), $("#to").val());
        });

      });
