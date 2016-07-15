Meteor.subscribe("theUsers");

Template.events.helpers({
  categories: function() {
    // console.log(Meteor.users.find({_id: Meteor.userId()}).fetch()[0].categories);
    return Meteor.users.find({_id: Meteor.userId()}).fetch()[0].categories; //
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
