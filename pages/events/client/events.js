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
    console.log(Tasks.find({createdBy: Meteor.userId()}).fetch());
    return Tasks.find({createdBy: Meteor.userId()}).fetch(); //
  },
  goals: function() {
    console.log(Goals.find({createdBy: Meteor.userId()}).fetch());
    return Goals.find({createdBy: Meteor.userId()}).fetch(); //
  },
  texts: function() {
    console.log(Texts.find({createdBy: Meteor.userId()}).fetch());
    return Texts.find({createdBy: Meteor.userId()}).fetch(); //
  },
});

Template.events.events({
    "click .js-add-category": function(event) {
        event.preventDefault();

        const cName = $(".js-category-name");

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

    },
})
