Template.settings.helpers({
  collaborator: function() {
    return Template.instance().collaborator.get();
  },
  checked: function(){
    return Template.instance().check.get();
  },

});

Template.settings.events({
  "click .js-look-collaborator": function(event, template) {
    event.preventDefault();

    var collaborator = $(".js-collaborator-email").val();
    var c = Meteor.users.findOne({"emails.address": collaborator}, {fields: {emails: 1, _id: 1, profile: 1}});

    if (c === undefined || c === null) {
      sAlert.error("We couldn't find that email, try again.", {position: "top-right"});
      return;
    } else if (c._id === Meteor.userId()) {
      sAlert.warning("Interesting... so you want to be your own collaborator.", {position: "top-right"});
      return;
    } else {
      c.sender = Meteor.userId();
      template.collaborator.set(c);
      console.log(c);
    }

  },
  "click .js-request": function(event, template) {
    event.preventDefault();

    var u = this;

    Meteor.call("sendRequest", u, function(error) {
      if (error) {
        console.log(error.reason);
        sAlert.error("Sorry: " + error.reason);
      } else {
        sAlert.info("Request sent to " + u.profile.first + " " + u.profile.last, {position: "top-right"});
      }
    });
  },

  "click .js-save-reminder-settings": function(event, template){
    var d = $(".js-distance-select").val();
      Meteor.call("setDistanceReminder", d);
      var t = $(".js-time-select").val();
      Meteor.call("setTimeReminder", t);
    sAlert.success("Reminder settings saved");
  },

});

Template.settings.onCreated(function() {
  this.collaborator = new ReactiveVar();
  this.check = new ReactiveVar(false);
});
