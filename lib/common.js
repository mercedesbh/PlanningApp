hashCode = function(str) { // java String#hashCode
    var hash = 0;
    for (var i = 0; i < str.length; i++) {
        hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return hash;
}

intToRGB = function(i) {
    var c = (i & 0x00FFFFFF).toString(16).toUpperCase();
    return "00000".substring(0, 6 - c.length) + c;
}

checkTag = function(tTag) {
  var categos = Meteor.users.find({_id: Meteor.userId()}).fetch()[0].categories;

  var duplicate = _.filter(categos, function(cat) {
      x = cat.tags;
      console.log(x);
      for (var j = 0; j < x.length; j++) {
        console.log(x[j].tagName);
        console.log("the tag: " + tTag);
        // console.log(x[j].tagName);
        return x[j].tagName === tTag;
      }

  });

  return duplicate;
}

notification = function() {
  // Let's check if the browser supports notifications
  if (!("Notification" in window)) {
    console.log("This browser does not support desktop notification");
  }
  // Let's check whether notification permissions have alredy been granted
  else if (Notification.permission === "granted") {
    // If it's okay let's create a notification
    // var notification = new Notification("Hi there!");
  }
  // Otherwise, we need to ask the user for permission
  else if (Notification.permission !== 'denied' || Notification.permission === "default") {
    Notification.requestPermission(function(permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {

        const options = {
          body: "Welcome, it's nice to see you.",
          icon: "/images/size64.png",
        }

        var notification = new Notification("Hi there!", options);
      }
    });
  }

  // At last, if the user has denied notifications, and you
  // want to be respectful there is no need to bother them any more.
}

firstEntry = function() {
  // console.log(Tasks.find({createdBy: Meteor.userId()}).fetch());
  var y = Tasks.find({createdBy: Meteor.userId()}).fetch();
  // console.log(y);
  var p = y.concat(Goals.find({createdBy: Meteor.userId()}).fetch(), Texts.find({createdBy: Meteor.userId()}).fetch());
  var x = p.sort(function(a, b) {
    if (a.createdAt < b.createdAt) {
      return -1;
    }
    if (a.createdAt > b.createdAt) {
      return 1;
    }
    return 0;
  });
  // console.log(x);
  return x[0];
}

moreTasksInGoal = function() {
    var x = document.createElement("INPUT");
    x.setAttribute("class", "css-input-new-task js-task-of-goal form-control");
    x.setAttribute("type", "text");
    x.setAttribute("value", "");
    x.setAttribute("placeholder", "Enter task");
    // document.body.appendChild(x);
    $(".js-goal-tasks").append(x);
}

// geoBoolean = function() {
//   var geoBoo = Meteor.users.findOne({_id: Meteor.userId()},{fields: {settings: 1} });
//   return geoBoo.settings.geoReminder;
// }

// find solution to this
// checkForNew = function() {
//   var h = Meteor.users.find({notifications: true});
//   var checkForNotify = h.observeChanges({
//     added: function (id, fields) {
//       // console.log(id);
//       console.log(fields);
//       sAlert.info("New notification.", {position: "top-right"});
//     },
//   });
// }
