Meteor.subscribe("theTasks");
Meteor.subscribe("theGoals");
Meteor.subscribe("theTexts");
Meteor.subscribe("theCategories");

// MUST BE REMOVED BEFORE PRODUCTION STAGE
Deps.autorun(function () {
  Meteor.subscribe("theUsers");
});
// END

Template.layout.helpers({
    userName: function() {
        const liveUser = Meteor.userId();
        return Meteor.users.findOne({
            _id: liveUser
        });
    },
    highlightUpcoming: function() {
      return Template.instance().upcoming.get();
    },
    highlightEvents: function() {
      return Template.instance().events.get();
    },
    highlightCalendar: function() {
      return Template.instance().calendar.get();
    },
    highlightSearch: function() {
      return Template.instance().search.get();
    },

});

Template.layout.events({
    "click .js-logout": function(event) {
        event.preventDefault();

        Meteor.logout();
        // Router.go('/');
    },
    "click .css-sidenav-upcoming": function(event, template) {
      template.upcoming.set("css-side-nav-highlight");
      template.events.set("");
      template.calendar.set("");
      template.search.set("");
    },
    "click .css-sidenav-events": function(event, template) {
      template.upcoming.set("");
      template.events.set("css-side-nav-highlight");
      template.calendar.set("");
      template.search.set("");
    },
    "click .css-sidenav-calendar": function(event, template) {
      template.upcoming.set("");
      template.events.set("");
      template.calendar.set("css-side-nav-highlight");
      template.search.set("");
    },
    "click .css-sidenav-search": function(event, template) {
      template.upcoming.set("");
      template.events.set("");
      template.calendar.set("");
      template.search.set("css-side-nav-highlight");
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
    }
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
    // "keypress .js-task-location": function(event, template){
    //   template.map.set(true);
    // },
    // "blur .js-task-location": function(event, template){
    //   if ($(".js-task-location").val() == 0){
    //     template.map.set(false);
    //   }
    // },
    "click .js-add-entry": function(event) {
        event.preventDefault();

        if ($(".js-modal-select").val() == "task") {

            const tTitle = $(".js-task-title").val();
            console.log($(".js-task-title").val());

            const tDate = $(".js-task-date").val();
            var tLocation = $(".js-task-location").val();
            var tNote = $(".js-task-note").val();

            if (tLocation == "") {
                tLocation = null;
            }
            if (tNote == "") {
                tNote = null;
            }

            // alert(tDate);

            const newTask = {
                title: tTitle,
                date: tDate,
                location: tLocation,
                note: tNote,
                createdAt: new Date(),
                createdBy: Meteor.userId(),
                modified: new Date(),
                completed: false
                    // isGoal: ???
                    // reminder: ???
                    // tag: ???
                    // priority: ???
                    // repeat: ???
            }

            alert("task");

            Meteor.call("createTask", newTask);

            $(".js-task-title").val("");
            $(".js-task-date").val("");
            $(".js-task-location").val("");
            $(".js-task-note").val("");


        } else if ($(".js-modal-select").val() == "goal") {

            const gTitle = $(".js-goal-title").val();
            console.log(gTitle);
            const gDateS = $(".js-goal-date-s").val();
            const gDateF = $(".js-goal-date-f").val();
            var gLocation = $(".js-goal-location").val();
            var gNote = $(".js-goal-note").val();

            if (gLocation == "") {
                gLocation = null;
            }
            if (gNote == "") {
                gNote = null;
            }

            const newGoal = {
                title: gTitle,
                start_date: gDateS,
                finish_date: gDateF,
                location: gLocation,
                note: gNote,
                createdAt: new Date(),
                createdBy: Meteor.userId(),
                modified: new Date(),
                completed: false,
                tasks: []
                    // isGoal: ???
                    // reminder: ???
                    // tag: ???
                    // priority: ???
                    // repeat: ???
            }

            //alert("goal");

            Meteor.call("createGoal", newGoal);

            $(".js-goal-title").val("");
            $(".js-goal-date-s").val("");
            $(".js-goal-date-f").val("");
            $(".js-goal-location").val("");
            $(".js-goal-note").val("");

        } else if ($(".js-modal-select").val() == "text") {

            const txtTitle = $(".js-text-title").val();
            const txtText = $(".js-text-text").val();

            const newText = {
                title: txtTitle,
                text: txtText,
                createdAt: new Date(),
                createBy: Meteor.userId(),
                modified: new Date()
                    // reminder: ???
                    // notes [???]
            }

            alert("text");
            Meteor.call("createText", newText);

            $(".js-text-title").val("");
            $(".js-text-text").val("");
        }

        $('.modal').modal('hide');
    },
    //Map event
    "click .js-submit-location": function(event) {
      event.preventDefault();
      const origin = $(".js-start").val();
      const destination = $(".js-end").val();
      console.log(origin);
      console.log(destination);
      calculateRoute(origin, destination);
    }
});

function calculateRoute(from, to) {
        var directionsService = new google.maps.DirectionsService();
        var directionsRequest = {
          origin: from,
          destination: to,
          travelMode: google.maps.DirectionsTravelMode.DRIVING,
        };
        console.log("sending request");
        // console.dir(directionsRequest);
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
            }
            else
              $("#error").append("Unable to retrieve your route<br />");
          }
        );
      }

      $(document).ready(function() {
        // If the browser supports the Geolocation API
        if (typeof navigator.geolocation == "undefined") {
          $("#error").text("Your browser doesn't support the Geolocation API");
          return;
        }

        $("#from-link, #to-link").click(function(event) {
          event.preventDefault();
          var addressId = this.id.substring(0, this.id.indexOf("-"));

          navigator.geolocation.getCurrentPosition(function(position) {
            var geocoder = new google.maps.Geocoder();
            geocoder.geocode({
              "location": new google.maps.LatLng(position.coords.latitude, position.coords.longitude)
            },
            function(results, status) {
              if (status == google.maps.GeocoderStatus.OK)
                $("#" + addressId).val(results[0].formatted_address);
              else
                $("#error").append("Unable to retrieve your address<br />");
            });
          },
          function(positionError){
            $("#error").append("Error: " + positionError.message + "<br />");
          },
          {
            enableHighAccuracy: true,
            timeout: 10 * 1000 // 10 seconds
          });
        });

        $("#calculate-route").submit(function(event) {
          event.preventDefault();
          calculateRoute($("#from").val(), $("#to").val());
        });

});

Template.layout.onCreated(function() {
  if (Meteor.isClient) {
    Meteor.startup(function() {
      GoogleMaps.load({ v: '3', key: 'AIzaSyBjJkcSNWBO1LHLusupVT4bSMXUgwV1w3M', libraries: 'places' });
    });
  }

    this.upcoming = new ReactiveVar("");
    this.events = new ReactiveVar("");
    this.calendar = new ReactiveVar("");
    this.search = new ReactiveVar("");

    if (Router.current().route.getName() == "upcoming") {
      this.upcoming = new ReactiveVar("css-side-nav-highlight");
      this.events = new ReactiveVar("");
      this.calendar = new ReactiveVar("");
      this.search = new ReactiveVar("");

    } else if (Router.current().route.getName() == "events") {
      this.events = new ReactiveVar("");
      this.events = new ReactiveVar("css-side-nav-highlight");
      this.calendar = new ReactiveVar("");
      this.search = new ReactiveVar("");

    } else if (Router.current().route.getName() == "calendar") {
      this.calendar = new ReactiveVar("");
      this.events = new ReactiveVar("");
      this.calendar = new ReactiveVar("css-side-nav-highlight");
      this.search = new ReactiveVar("");

    } else if (Router.current().route.getName() == "search") {
      this.search = new ReactiveVar("");
      this.events = new ReactiveVar("");
      this.calendar = new ReactiveVar("");
      this.search = new ReactiveVar("css-side-nav-highlight");
    }
});

Template.modal.onCreated(function() {
    this.taskChosen = new ReactiveVar(true);
    this.goalChosen = new ReactiveVar(false);
    this.textChosen = new ReactiveVar(false);
    this.map = new ReactiveVar(false);

    //Map onCreated
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
    GoogleMaps.load({ v: '3', key: 'AIzaSyBjJkcSNWBO1LHLusupVT4bSMXUgwV1w3M', libraries: 'places' });

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
            console.log(lat +", " +lng);

          });
      } else {
          console.log("never reaches");
             latlng = new google.maps.LatLng(42.358970, -71.066093);
      }
          var input = document.getElementById('end');
          var autocomplete = new google.maps.places.Autocomplete(input);

          // When the user selects an address from the dropdown,
          google.maps.event.addListener(autocomplete, 'place_changed', function() {

               // Get the place details from the autocomplete object.
               var place = autocomplete.getPlace();


              //  console.log("place: " + JSON.stringify(place) );
          });
      };
});
