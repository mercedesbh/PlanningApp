Template.settings.helpers({
  collaborator: function() {
    return Template.instance().collaborator.get();
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

    // find way to get the user id upon the click and not user ReactiveVar (settings.js :32)
    var u = template.collaborator.get();

    Meteor.call("sendRequest", u);
  },

});

Template.settings.onCreated(function() {
  this.collaborator = new ReactiveVar();
});
