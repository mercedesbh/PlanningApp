Template.layout.helpers({
  userName: function() {
    const liveUser = Meteor.userId();
    return Meteor.users.findOne({_id: liveUser});
  }
});

Template.layout.events({
  "click .js-logout": function() {
    event.preventDefault();
    
    Meteor.logout();
    Router.go('/');
  }
});
