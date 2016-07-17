Meteor.subscribe("theUsers");
Meteor.subscribe("theTasks");
Meteor.subscribe("theGoals");
Meteor.subscribe("theTexts");

Template.events.helpers({
  categories: function() {
    // console.log(Meteor.users.find({_id: Meteor.userId()}).fetch()[0].categories);
    return Meteor.users.find({_id: Meteor.userId()}).fetch()[0].categories; //
  },
  tasks: function() {
    // console.log(Tasks.find({createdBy: Meteor.userId()}).fetch());
    return Tasks.find({createdBy: Meteor.userId()}).fetch(); //
  },
  goals: function() {
    // console.log(Goals.find({createdBy: Meteor.userId()}).fetch());
    return Goals.find({createdBy: Meteor.userId()}).fetch(); //
  },
  texts: function() {
    // console.log(Texts.find({createdBy: Meteor.userId()}).fetch());
    return Texts.find({createdBy: Meteor.userId()}).fetch(); //
  },
  showCategoryInput: function() {
    return Template.instance().showCategoryInput.get();
  },

});

Template.events.events({
    "click .css-new-category": function(event, template) {
      event.preventDefault();
      // alert("Here");

      template.showCategoryInput.set(true);
      // $(".js-category-name-input").focus();

      setTimeout(function() {$(".js-category-name-input").focus();}, 100);
    },
    "blur .js-category-name-input": function(event, template) {
      event.preventDefault();
      // alert("Here");

      if ($(".js-category-name-input").val() == 0){
        template.showCategoryInput.set(false);
      }
    },
    "click .js-create-category": function(event, template) {
      event.preventDefault();

      // alert("test");
      const cName = $(".js-category-name-input").val();

      const newCategory = {
        name: cName,
        tasks: [],
        goals: [],
        texts: [],
        createdAt: new Date(),
        owner: Meteor.userId(),
        modified: new Date()
      }

      // alert("add code for new category creation");
      Meteor.call("createCategory", newCategory);

      $(".js-category-name-input").val("");

      template.showCategoryInput.set(false);
    },

});

Template.events.onCreated(function() {
    this.showCategoryInput = new ReactiveVar(false);
});
