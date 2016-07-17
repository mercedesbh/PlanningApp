Meteor.publish("theTasks", function() {return Tasks.find();})
Meteor.publish("theGoals", function() {return Goals.find();})
Meteor.publish("theTexts", function() {return Texts.find();})
// Meteor.publish("theCategories", function() {return Categories.find();});

// MUST BE REMOVED BEFORE PRODUCTION STAGE
Meteor.publish("theUsers", function() {
  return Meteor.users.find();
});
// END
