Deps.autorun(function() {
    Meteor.subscribe("theUsers");
});
Meteor.subscribe("theTasks");
Meteor.subscribe("theGoals");
Meteor.subscribe("theTexts");
Meteor.subscribe("theCategories");

Template.layout.helpers({
    userName: function() {
        const liveUser = Meteor.userId();
        return Meteor.users.findOne({
            _id: liveUser
        });
    },
    highlight: function(template) {
      var currentRoute = Router.current().route.getName();
      console.log(currentRoute);
      return currentRoute && template === currentRoute ? 'css-side-nav-highlight' : '';
    },
});

Template.layout.events({
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
            var tTime = $(".js-task-date").val();
            var tDate = $(".js-task-date").val();
            var tLocation = $(".js-task-location").val();
            var tNote = $(".js-task-note").val();
            const tPriority = $(".js-select-task-priority").val();
            const tCategory = $(".js-select-category").val();
            var tTag = $(".js-select-task-tag").val();
            var tTagName = $(".js-new-tag-name").val();

            if (tTag && tTagName) {
                alert("Create new tag or use existing one?");
                return;
            } else if (tTagName.length > 0 || tTagName != null) {
                console.log("here");
                tTag = tTagName;
                // console.log(tTag);
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
                tTagName: tTag,
                tTagColor: tTagColor
            }

            Meteor.call("createTask", newTask, function(error, result) {
                if (error) {
                    console.log(error);
                } else {
                    var lastEntry = Tasks.findOne({}, {sort: {createdAt: -1,limit: 1}})._id;
                    Meteor.call("linkTask", lastEntry, tCategory);
                    if (tTag.length > 0) {
                      Meteor.call("linkTag", tCategory, tTagObj);
                    }

                    $(".js-task-title").val("");
                    $(".js-task-date").val("");
                    $(".js-task-location").val("");
                    $(".js-task-note").val("");
                    // const tTitle = $(".js-task-title").val();
                    // var tTime = $(".js-task-date").val();
                    // var tDate = $(".js-task-date").val();
                    // var tLocation = $(".js-task-location").val();
                    // var tNote = $(".js-task-note").val();
                    // const tPriority = $(".js-select-task-priority").val();
                    // const tCategory = $(".js-select-category").val();
                }
            });


        } else if ($(".js-modal-select").val() == "goal") {

            const gTitle = $(".js-goal-title").val();
            const gDateS = $(".js-goal-date-s").val();
            const gDateF = $(".js-goal-date-f").val();
            const gPriority = $(".js-select-goal-priority").val();
            var gLocation = $(".js-goal-location").val();
            var gNote = $(".js-goal-note").val();

            gDateST = moment(gDateS).format('h:mm A');
            gDateSD = moment(gDateS).format('MMM Do YY');

            gDateFT = moment(gDateF).format('h:mm A');
            gDateFD = moment(gDateF).format('MMM Do YY');


            if (gLocation == "") {
                gLocation = null;
            }
            if (gNote == "") {
                gNote = null;
            }

            const newGoal = {
                goal: "goal",
                title: gTitle,
                start_date: gDateSD,
                start_time: gDateST,
                finish_date: gDateFD,
                finish_time: gDateFT,
                location: gLocation,
                note: gNote,
                createdAt: new Date(),
                createdBy: Meteor.userId(),
                modified: new Date(),
                completed: false,
                tasks: [],
                priority: gPriority,
                // isGoal: ???
                // reminder: ???
                // tag: ???
                // repeat: ???
            }

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
                text: "text",
                title: txtTitle,
                text: txtText,
                createdAt: new Date(),
                createdBy: Meteor.userId(),
                modified_time: moment(new Date()).format('h:mm A'),
                modified_date: moment(new Date()).format('MMM Do YY'),
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
        function(response, status) {
            console.dir([status, response, new Date()]);
            if (status == google.maps.DirectionsStatus.OK) {
                console.log("routing");
                new google.maps.DirectionsRenderer({
                    map: GoogleMaps.maps.initMap.instance,
                    directions: response
                });
            } else
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
            function(positionError) {
                $("#error").append("Error: " + positionError.message + "<br />");
            }, {
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
            GoogleMaps.load({
                v: '3',
                key: 'AIzaSyBjJkcSNWBO1LHLusupVT4bSMXUgwV1w3M',
                libraries: 'places'
            });
        });
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
                document.getElementById('start').defaultValue = lat + ", " + lng;
                console.log(lat + ", " + lng);

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
