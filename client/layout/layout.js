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
        return Meteor.users.findOne({_id: liveUser});
    },
    highlight: function(template) {
      var currentRoute = Router.current().route.getName();
      return currentRoute && template === currentRoute ? 'css-side-nav-highlight' : '';
    },
    notifications: function() {
      var n = Meteor.users.find({_id: Meteor.userId()}).fetch()[0].notifications;
      return n;
    },
    // edit: function() {
    //   return Template.instance().edit.get();
    // },
    notificationNum: function() {
      var t = Session.get("numOfNotifications");
      var l = Meteor.users.findOne({_id: Meteor.userId()}).notifications.length;

      var j = Meteor.users.findOne({_id: Meteor.userId()}).notifications;
      var r = j[l - 1];

      if ((l > t) && r.hasOwnProperty("notification")) {
        sAlert.info("New Notification: " + r.notification);
      } else if ((l > t) && r.hasOwnProperty("collab")) {
        sAlert.info("New collaborator entry", {position: "top-right"});
      }
      Session.setPersistent("numOfNotifications", l);
      // var w = Session.get("numOfNotifications");
      // Session.setPersistent("numOfNotifications", w - 1);
      // Session.setPersistent("numOfNotifications", Meteor.users.findOne({_id: Meteor.userId()}).notifications.length);
      // Meteor.users.find({_id: Meteor.userId()}).fetch()[0].notifications.length;

      return Session.get("numOfNotifications");
    },

});

Template.layout.events({
    "click .js-logout": function(event) {
        event.preventDefault();

        Session.setPersistent("numOfNotifications", 0);
        Meteor.logout();
        Router.go("/login")
    },
    "click .js-accept-request": function(event) {
      event.preventDefault();

      // console.log(this.sender);
      // console.log(this);
      Meteor.call("linkCollab", this.sender);
      // console.log("here");
      console.log(this);
      Meteor.call("removeNotif", this);
    },
    "click .js-deny-request": function(event) {
      event.preventDefault();

      Meteor.call("removeNotif", this);
    },
    "click .js-notifications-done": function(event) {
      event.preventDefault();

      // console.log(this);

      Meteor.call("removeNotif", this);
    },
    "click .js-completed": function(event) {
      event.preventDefault();


      console.log(this);
      console.log("here");
      Meteor.call("entryComplete", this);
      console.log("there");
    },
});

Template.layout.onRendered(function() {

    function getCurrentLocation(position) {
        if (navigator.geolocation) {
          var map = GoogleMaps.maps.initMap.instance;
          console.log("clicked");
          var center = map.getCenter();
            console.log("map loaded with geolocation");
             google.maps.event.trigger(map, 'resize');
             map.setCenter(center);
          console.log("detecting current location");
          // navigator.geolocation.watchPosition(showPosition);
          var currLat = position.coords.latitude;
          var currLng = position.coords.longitude;

          for(i = 0; i < Tasks.find().count(); i++){
            var t = Tasks.find().fetch()[i];
            var destLat = t.coordinates.lat
            var destLng = t.coordinates.lng
            console.log("going to calculate distance");
            var distance = calculateDistance(currLat, currLng, destLat, destLng);
            console.log(distance);
            // console.log(distance);
            var s = Meteor.users.findOne({_id: Meteor.userId()},{fields: {settings: 1} });
            var d = s.settings.remindDistance;
            var count = t.reminderCount
            if (distance <= d){
              if(count < 3){
                console.log(count);
                Meteor.call("updateReminderCount", t._id, count);
                const geoNotif = {
                  title: "Reminder: You are less than " + d + " km away from " + t.location + ". Complete " + t.title + "? ",
                  date_time: new Date(),
                  geo: true
                }
                Meteor.call("addNotification", geoNotif);
                console.log("added to notifications");

              }
            }
          }
        }
    }
    function error(err) {
      console.warn('ERROR(' + err.code + '): ' + err.message);
    }
    target = {
      latitude : 0,
      longitude: 0
    };
    options = {
      enableHighAccuracy: false,
      timeout: 5000,
      maximumAge: 0
    };
    id = navigator.geolocation.watchPosition(getCurrentLocation, error, options);

    function calculateDistance (lat1,lon1,lat2,lon2) {
      var R = 6371; // Radius of the earth in km
      var dLat = deg2rad(lat2-lat1);  // deg2rad below
      var dLon = deg2rad(lon2-lon1);
      var a =
        Math.sin(dLat/2) * Math.sin(dLat/2) +
        Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
        Math.sin(dLon/2) * Math.sin(dLon/2)
        ;
      var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      var d = R * c; // Distance in km
      return d;
    }

    function deg2rad(deg) {
      return deg * (Math.PI/180)
    }
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
    more: function() {
      return Template.instance().more.get();
    },
    checked: function() {
      return Template.instance().check.get();
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
    userGoals: function() {
      return Goals.find({createdBy: Meteor.userId()}, {fields: {title: 1}}).fetch();
    },
    collaborator: function() {
      return Meteor.users.find({_id: Meteor.userId()}).fetch()[0].collaborators;
    },
});

Template.modal.events({
    "change .js-modal-select": function(event, template) {
        if ($(event.target).val() == "task") {
            template.taskChosen.set(true);
            template.goalChosen.set(false);
            template.textChosen.set(false);
            template.more.set(false);
        } else if ($(event.target).val() == "goal") {
            template.taskChosen.set(false);
            template.goalChosen.set(true);
            template.textChosen.set(false);
            template.more.set(false);
        } else if ($(event.target).val() == "text") {
            template.taskChosen.set(false);
            template.goalChosen.set(false);
            template.textChosen.set(true);
            template.more.set(false);
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
    "change .js-collaborator-select": function(event) {
      event.preventDefault();

      var u = $(".js-collaborator-select option:selected").text();
      // console.log(this);
      for (var i = 0; i < this.length; i++) {
        if (this[i].collaboratorName === u) {
          Session.set("collabo", this[i]);
          console.log(this[i]);
          return;
        }
      }
    },
    "click .js-add-entry": function(event, template) {
        event.preventDefault();

        if ($(".js-modal-select").val() == "task") {

            const tTitle = $(".js-task-title").val();
            var tTime = $(".js-task-date").val();
            var tDate = $(".js-task-date").val();
            var tLocation = $(".js-task-destination").val();
            const tCoordinatesLat = document.getElementById('dvCoorLat').value;
            const tCoordinatesLng = document.getElementById('dvCoorLng').value;
            var tNote = $(".js-task-note").val();
            const tPriority = $(".js-select-task-priority").val();
            const tCategory = $(".js-select-category").val();
            var tTagSelect = $(".js-select-task-tag").val();
            var tTagNew = $(".js-new-tag-name").val();
            var tOwner = $(".js-collaborator-select").val();

            if (tOwner === "" || tOwner === undefined || tOwner === null) {
              // console.log("NO COLLAB");
              tOwner = Meteor.userId();
            } else {
              var collaborator = true;
            }

            if (tPriority === "<span style='color: #666666'>Neutral</span>") {
              var tPriorityLevel = 1;
            } else if (tPriority === "<span style='color: #0c59cf'>Important</span>") {
              var tPriorityLevel = 2;
            } else if (tPriority === "<span style='color: #e61610'>Urgent</span>") {
              var tPriorityLevel = 3;
            }

            var tTag;
            var tTagColor;

            console.log(tTagNew);
            console.log("selected tag: [" + tTagSelect + "]");

            if ((tTagSelect === "null" || tTagSelect === null || tTagSelect === undefined) && (tTagNew === "" || tTagNew === null || tTagNew === undefined)) {
              tTag = null;
              tTagColor = null;
            } else if ((tTagSelect !== "null" && tTagSelect !== undefined) && tTagNew !== "") {
              sAlert.warning("Select an existing tag or create one.", {position: "top-right"});
              return;
            } else if ((tTagSelect !== "null" && tTagSelect !== undefined) && tTagNew === "") {
              console.log("here");
              tTag = tTagSelect;
              tTagColor = intToRGB(hashCode(tTag));
            } else if ((tTagSelect === "null" || tTagSelect === undefined) && tTagNew !== "") {
              tTag = tTagNew;
              tTagColor = intToRGB(hashCode(tTag));
            }
            // else {
            //   tTag = null;
            //   tTagColor = null;
            // }

            const tStart = tDate;
            tTime = moment(tTime).format('h:mm A');
            tDate = moment(tDate).format('MMM Do YY');

            if (tLocation == "") {
                tLocation = null;
            }
            if (tNote == "") {
                tNote = null;
            }
            const coor = {
              lat: tCoordinatesLat,
              lng: tCoordinatesLng
            }

            const newTask = {
                task: "task",
                title: tTitle,
                date: tDate,
                start: tStart,
                category: tCategory,
                time: tTime,
                location: tLocation,
                coordinates: coor,
                note: tNote,
                createdAt: new Date(),
                createdBy: tOwner,
                modified: new Date(),
                completed: false,
                tag: tTag,
                tagColor: tTagColor,
                priority: tPriority,
                collaborator: collaborator,
                reminderCount: 1,
                pLevel: tPriorityLevel
                // isGoal: ???
                // reminder: ???
                // repeat: ???
            }

            const tTagObj = {
                tagName: tTag,
                tagColor: tTagColor
            }

            if (newTask.collaborator == true) {
              const collabNotifObj = {
                  _id: Random.id(),
                  title: "New entry task from " + Session.get("collabo").collaboratorName,
                  date_time: new Date(),
                  collab: true,
                  sendTo: tOwner
              }
              console.log("XXXXXXX");
              Meteor.call("addNotification", collabNotifObj);
            }

            console.log("+:" + tTag);
            Meteor.call("createTask", newTask, function(error, result) {
              if (error) {
                console.log(error);
              } else {
                var lastEntry = Tasks.findOne({}, {sort: {createdAt: -1, limit: 1}});
                // console.log(lastEntry._id);
                $('#calendar').fullCalendar( 'renderEvent', lastEntry, 'stick');
                Meteor.call("linkTask", lastEntry._id, tCategory);
                if (tTag !== null || tTag !== "" || tTag !== "null") {

                  var existing = checkTag(tTag);
                  console.log("so..." + existing);

                  if (existing.length <= 0) {
                    Meteor.call("linkTag", tCategory, tTagObj);
                  }

                }

                sAlert.success('Success! New task created.');
                $(".js-task-title").val("");
                $(".js-task-date").val("");
                $(".js-task-destination").val("");
                $(".js-task-note").val("");

              }
            });


        } else if ($(".js-modal-select").val() == "goal") {

            const gTitle = $(".js-goal-title").val();
            const gDateS = $(".js-goal-date-s").val();
            const gDateF = $(".js-goal-date-f").val();
            const gPriority = $(".js-select-goal-priority").val();
            var gNote = $(".js-goal-note").val();
            const gCategory = $(".js-select-category").val();
            var gTagSelect = $(".js-select-goal-tag").val();
            var gTagNew = $(".js-new-tag-name").val();

            var first = $(".js-task-of-goal").val();
            var second = $(".js-task-of-goal2").val();
            var third = $(".js-task-of-goal3").val();
            var fourth = $(".js-task-of-goal4").val();
            var fifth = $(".js-task-of-goal5").val();

            var taskArray = [first, second, third, fourth, fifth];

            taskArray = _.filter(taskArray, function(task) {
              if (task === "" || task === undefined || task === null) {
                return;
              } else {
                return 1;
              }
            });

            var gTag;
            var gTagColor;

            console.log(gTagNew);
            console.log("selected tag: [" + gTagSelect + "]");


            if ((gTagSelect === "null" || gTagSelect === null || gTagSelect === undefined) && (gTagNew === "" || gTagNew === null || gTagNew === undefined)) {
              gTag = null;
              gTagColor = null;
            } else if ((gTagSelect !== "null" && gTagSelect !== undefined) && gTagNew !== "") {
              sAlert.warning("Select an existing tag or create one.", {position: "top-right"});
              return;
            } else if ((gTagSelect !== "null" && gTagSelect !== undefined) && gTagNew === "") {
              gTag = gTagSelect;
              gTagColor = intToRGB(hashCode(gTag));
            } else if ((gTagSelect === "null" || gTagSelect === undefined) && gTagNew !== "") {
              gTag = gTagNew;
              gTagColor = intToRGB(hashCode(gTag));
            }
            // else {
            //   gTag = null;
            //   gTagColor = null;
            // }

            gDateST = moment(gDateS).format('h:mm A');
            gDateSD = moment(gDateS).format('MMM Do YY');

            gDateFT = moment(gDateF).format('h:mm A');
            gDateFD = moment(gDateF).format('MMM Do YY');

            if (gNote == "") {
                gNote = null;
            }

            const newGoal = {
                goal: "goal",
                title: gTitle,
                category: gCategory,
                start: gDateS,
                time: gDateST,
                date: gDateSD,
                finish_date: gDateFD,
                finish_time: gDateFT,
                note: gNote,
                createdAt: new Date(),
                createdBy: Meteor.userId(),
                modified: new Date(),
                completed: false,
                tasks: taskArray,
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
                var lastEntry = Goals.findOne({}, {sort: {createdAt: -1, limit: 1}});
                $('#calendar').fullCalendar( 'renderEvent', lastEntry, 'stick');
                Meteor.call("linkGoal", lastEntry._id, gCategory);
                if (gTag !== null || gTag !== "" || gTag !== "null") {

                  var existing = checkTag(gTag);
                  console.log(existing);

                  if (existing.length <= 0) {
                    Meteor.call("linkTag", gCategory, gTagObj);
                  }

                }

                sAlert.success('Success! New goal created.');
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
            var txtTagSelect = $(".js-select-text-tag").val();
            var txtTagNew = $(".js-new-tag-name").val();

            var txtTag;
            var txtTagColor;

            console.log(txtTagNew);
            console.log("selected tag: [" + txtTagSelect + "]");

            if ((txtTagSelect !== "null" && txtTagSelect !== undefined) && txtTagNew !== "") {
              sAlert.warning("Select an existing tag or create one.", {position: "top-right"});
              return;
            } else if ((txtTagSelect !== "null" && txtTagSelect !== undefined) && txtTagNew === "") {
              txtTag = txtTagSelect;
              txtTagColor = intToRGB(hashCode(txtTag));
            } else if ((txtTagSelect === "null" || txtTagSelect === undefined) && txtTagNew !== "") {
              txtTag = txtTagNew;
              txtTagColor = intToRGB(hashCode(txtTag));
            } else {
              txtTag = null;
              txtTagColor = null;
            }

            const newText = {
                text: "text",
                title: txtTitle,
                category: txtCategory,
                text: txtText,
                createdAt: new Date(),
                createdBy: Meteor.userId(),
                tag: txtTag,
                tagColor: txtTagColor,
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

                sAlert.success('Success! New text created.');
                $(".js-text-title").val("");
                $(".js-text-text").val("");
              }

          });

        }
        template.more.set(false);
        $('.modal').modal('hide');
        // location.reload();

    },
    "click .js-submit-location": function(event) {
        event.preventDefault();
        const origin = $(".js-task-origin").val();
        const destination = $(".js-task-destination").val();
        console.log("Origin: " + origin + '\n' +"Destination: " + destination);
        calculateRoute(origin, destination);
    },
    "click .css-entry-more-close": function(event, template) {
      event.preventDefault();

      template.more.set(false);
    },
    "click .css-entry-more-open": function(event, template) {
      event.preventDefault();

      template.more.set(true);
    },
    "click .js-task-goal": function(event, template) {
      // event.preventDefault();

      if ($('.js-task-goal').is(":checked")) {
        template.check.set(true);
      } else {
        template.check.set(false);
      }
    },
    "click .js-new-task-input": function(event) {
      // event.preventDefault();

      var y = Session.get("numOfTasks");
      Session.set("numOfTasks", y + 1);
      console.log(y);
      if (y < 5) {
        moreTasksInGoal();
      } else {
        sAlert.warning("Let's only stick to 5 tasks for now.", {position: "top-right"})
      }

    },

});

Meteor.startup(function () {

    sAlert.config({
        effect: 'flip',
        position: 'bottom',
        timeout: 4000,
        html: false,
        onRouteClose: true,
        stack: false,
        offset: 0,
        beep: false,
        onClose: _.noop //
    });

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
                    map: GoogleMaps.maps.initMap,
                    directions: response
                });
            } else
                $("#error").append("Unable to retrieve your route<br />");
        }
    );
}

$("#calculate-route").submit(function(event) {
    event.preventDefault();
    calculateRoute($("#from").val(), $("#to").val());
});

Template.modal.onCreated(function() {
    this.taskChosen = new ReactiveVar(true);
    this.goalChosen = new ReactiveVar(false);
    this.textChosen = new ReactiveVar(false);
    this.map = new ReactiveVar(false);
    this.more = new ReactiveVar(false);
    this.check = new ReactiveVar(false);
    // this.edit = new ReactiveVar();
    // this.isEdit = new ReactiveVar(false);
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
    Session.set("numOfTasks", 1);
    // this.edit = new ReactiveVar();

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
          console.log("Can't track location");
      }
      return {
              zoom: 10,
              center: latlng,
              mapTypeId: google.maps.MapTypeId.ROADMAP
            };

      };
});

Meteor.setInterval(function() {
  var x = Tasks.find().fetch();
  var t = Session.get("numOfNotifications");
  var a = Meteor.users.findOne({_id: Meteor.userId()}).settings.remindTime;

  for (var i = 0; i < x.length; i++) {
    if ((x[i].date == moment(new Date()).format("MMM Do YY")) && (moment(x[i].start).subtract(a, 'minutes').format("h:mm A") == moment(new Date()).format("h:mm A"))) {

      const notification = {
        _id: Random.id(),
        title: x[i].title,
        date_time: new Date(),
        priority: x[i].priority
      }

      if (Notification.permission === "granted") {
        const theTitle = "Remember:";
        const options = {
          body: x[i].title,
          icon: "/images/size64.png",
        }

        var notify = new Notification(theTitle, options);
      } else {

        const configOverwrite = {
          effect: 'flip',
          position: 'top-right',
          timeout: 4000,
          stack: true,
          html: true,
          onRouteClose: true,
          stack: false,
          offset: 0,
          beep: false,
          onClose: _.noop
        }
        sAlert.warning('Remember: <br>' + x[i].title, configOverwrite);
      }


      Meteor.call("addNotification", notification);
      return;
      // console.log("Hey");
    }

    // Session.setPersistent("numOfNotifications", t + 1);

  }

}, 40000);

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
                  document.getElementById('dvCoorLat').defaultValue = coordinates.lat;
                  document.getElementById('dvCoorLng').defaultValue = coordinates.lng;

                  // Session.set('destCoor', coordinates);
                  // var coor = Session.get('destCoor');
                  // console.log(coor);

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
                  dvDistance.innerHTML += "Duration: " + duration;
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
        //************* GEOLOCATION WATCHPOSITION ***************//
        // var x = document.getElementById("demo");
        // function getCurrentLocation() {
        //     if (navigator.geolocation) {
        //       console.log("detecting current location");
        //         navigator.geolocation.watchPosition(showPosition);
        //     } else {
        //         x.innerHTML = "Geolocation is not supported by this browser.";
        //     }
        // }
        // function showPosition(position) {
        //     x.innerHTML = "Latitude: " + position.coords.latitude +
        //     "<br>Longitude: " + position.coords.longitude;
        // }
