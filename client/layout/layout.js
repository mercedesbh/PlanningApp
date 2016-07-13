Template.layout.helpers({
    userName: function() {
        const liveUser = Meteor.userId();
        return Meteor.users.findOne({
            _id: liveUser
        });
    },
});

Template.layout.events({
    "click .js-logout": function() {
        event.preventDefault();

        Meteor.logout();
        Router.go('/');
    },
    // "click .js-modal": function() {
    //     event.preventDefault();
    //
    // },

});

Template.modal.helpers({
  taskChosen: function(){
    return Template.instance().taskChosen.get();
  },
  goalChosen: function(){
    return Template.instance().goalChosen.get();
  },
  textChosen: function(){
    return Template.instance().textChosen.get();
  },
});


Template.modal.events({
  'change select': function(event, template){
    if($(event.target).val()=="task"){
      template.taskChosen.set(true);
      template.goalChosen.set(false);
      template.textChosen.set(false);

    }else if($(event.target).val()=="goal"){
      template.taskChosen.set(false);
      template.goalChosen.set(true);
      template.textChosen.set(false);
    }else if($(event.target).val()=="text"){
      template.taskChosen.set(false);
      template.goalChosen.set(false);
      template.textChosen.set(true);
    }
  }
});

Template.modal.onCreated(function(){
  this.taskChosen = new ReactiveVar(true);
  this.goalChosen = new ReactiveVar(false);
  this.textChosen = new ReactiveVar(false);

});

Template.modal.onRendered(function() {
    this.$('.datetimepicker5').datetimepicker();
});
