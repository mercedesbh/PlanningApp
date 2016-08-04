Meteor.methods({
  createTask: function(task) {
    Tasks.insert(task);
  },
  createGoal: function(goal) {
    Goals.insert(goal);
  },
  createText: function(text) {
    Texts.insert(text);
  },
  createCategory: function(category) {
    Meteor.users.update({_id: this.userId}, {$push: {categories: category}});
  },
  linkTask: function(lastEntry, category) {
    var x = Meteor.users.find({_id: this.userId}).fetch()[0].categories;
    for (var i = 0; i < x.length; i++) {
      if (x[i].name == category) {
        var y = x[i].tasks;
        y.push(lastEntry);
        // console.log(x);
        Meteor.users.update({_id: this.userId}, {$set: {"categories": x}});
      }
    }
  },
  linkGoal: function(lastEntry, category) {
    var x = Meteor.users.find({_id: this.userId}).fetch()[0].categories;
    for (var i = 0; i < x.length; i++) {
      if (x[i].name == category) {
        var y = x[i].goals;
        y.push(lastEntry);
        // console.log(x);
        Meteor.users.update({_id: this.userId}, {$set: {"categories": x}});
      }
    }
  },
  linkText: function(lastEntry, category) {
    var x = Meteor.users.find({_id: this.userId}).fetch()[0].categories;
    for (var i = 0; i < x.length; i++) {
      if (x[i].name == category) {
        var y = x[i].text;
        y.push(lastEntry);
        // console.log(x);
        Meteor.users.update({_id: this.userId}, {$set: {"categories": x}});
      }
    }
  },
  linkTag: function(category, tag) { // Meteor.call("addTag", tCategory, tTagObj);
    var c = Meteor.users.find({_id: this.userId}).fetch()[0].categories;
    for (var i = 0; i < c.length; i++) {
      if (c[i].name == category) {
        var b = c[i].tags;
        // console.log(b);
        b.push(tag);
        // console.log(b);
        // console.log(c);
        Meteor.users.update({_id: this.userId}, {$set: {"categories": c}});
      }
    }
  },
  sendRequest: function(u, i) {
    const m = {
      _id: Random.id(),
      notification: i.first + " " + i.last + " wants to be a collaborator",
      date_time: new Date(),
      sender: u.sender
    }
    var x = Meteor.users.update({_id: u._id}, {$push: {notifications: m}});
  },
  addNotification: function(notification) {
    if (notification.collab == true) {
      Meteor.users.update({_id: notification.sendTo}, {$addToSet: {"notifications": notification}});
    } else {
      Meteor.users.update({_id: this.userId}, {$addToSet: {"notifications": notification}});
    }

  },
  saveCoor: function(coordinates){
    Meteor.users.update({_id: this.userId}, {$addToSet: {"locations": coordinates}});
  },
  linkCollab: function(sender) {
    var e = Meteor.users.findOne({_id: sender}).profile;
    const d = {
      _id: Random.id(),
      collaboratorName: e.first + " " + e.last,
      collaboratorId: sender
    }
    var s = Meteor.users.findOne({_id: this.userId}).profile;
    const b = {
      _id: Random.id(),
      collaboratorName: s.first + " " + s.last,
      collaboratorId: this.userId
    }
    Meteor.users.update({_id: this.userId}, {$push: {collaborators: d}});
    Meteor.users.update({_id: sender}, {$push: {collaborators: b}});
    // figure out how to remove objects without an _id
  },
  removeNotif: function(item) {
    // console.log(item._id);
    Meteor.users.update({_id: this.userId}, {$pull: {'notifications': {_id: item._id}}});
  },
  editEntry: function(item, obj) {
    Tasks.update({_id: item}, {$set: obj});
  },
  setDistanceReminder: function(distance){
    Meteor.users.update({_id: this.userId}, {$set: {"settings.remindDistance": distance}});
  },
  setTimeReminder: function(time){
    Meteor.users.update({_id: this.userId}, {$set: {"settings.remindTime": time}});
  },
  updateReminderCount: function(id, count){
   Tasks.update({_id: id}, {$set: {"reminderCount": count+1}});
 },
 entryComplete: function(item) {
   if (item.hasOwnProperty("task")) {
     console.log("TASK");
     Tasks.update({_id: item._id}, {$set: {completed: true}});
   } else if (item.hasOwnProperty("goal")) {
     console.log("GOAL");
     Goals.update({_id: item._id}, {$set: {completed: true}});
   }
 }


  // addEvent( event ) {
  //     check( event, {
  //         title: String,
  //         start: String,
  //         end: String,
  //         type: String,
  //         guests: String
  //     });
  //
  //     try {
  //         return Events.insert( event );
  //     } catch ( exception ) {
  //         throw new Meteor.Error( '500', `${ exception }` );
  //     }
  // },
  // editEvent( event ) {
  //     check( event, {
  //         _id: String,
  //         title: Match.Optional( String ),
  //         start: String,
  //         end: String,
  //         type: Match.Optional( String ),
  //         guests: Match.Optional( String )
  //     });
  //   try {
  //     return Events.update( event._id, {
  //     $set: event
  //     });
  //   } catch ( exception ) {
  //     throw new Meteor.Error( '500', `${ exception }` );
  //   }
  // },
  // removeEvent( event ) {
  //     check( event, String );
  //     try {
  //         return Events.remove( event );
  //     } catch ( exception ) {
  //         throw new Meteor.Error( '500', `${ exception }` );
  //     }
  //   },
});
