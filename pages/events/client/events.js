// Meteor.subscribe("theUsers");
Meteor.subscribe("theTasks");
Meteor.subscribe("theGoals");
Meteor.subscribe("theTexts");

Template.events.helpers({
  categories: function() {
    // console.log(Meteor.users.find({_id: Meteor.userId()}).fetch()[0].categories);
    // console.log("finding categories");
    // console.dir(Meteor.userId());
    const user = Meteor.users.findOne(Meteor.userId()); //
    // console.dir(user);
    return user.categories
  },
  entries: function() {
    // console.log(Tasks.find({createdBy: Meteor.userId()}).fetch());
    var y = Tasks.find({createdBy: Meteor.userId()}).fetch();
    // console.log(y);
    var p = y.concat(Goals.find({createdBy: Meteor.userId()}).fetch(), Texts.find({createdBy: Meteor.userId()}).fetch());
    // var v = p.concat(Texts.find({createdBy: Meteor.userId()}).fetch());
    // console.log(p);
    return p;
  },
  // goals: function() {
  //   // console.log(Goals.find({createdBy: Meteor.userId()}).fetch());
  //   return Goals.find({createdBy: Meteor.userId()}).fetch(); //
  // },
  // texts: function() {
  //   // console.log(Texts.find({createdBy: Meteor.userId()}).fetch());
  //   return Texts.find({createdBy: Meteor.userId()}).fetch(); //
  // },
  showCategoryInput: function() {
    return Template.instance().showCategoryInput.get();
  },
  detailed: function() {
    //return Goals.findOne({_id:this._id});
    return Template.instance().detailedGoal.get();
  },
});

// Template.detailed.helpers({
//   detailedGoal: function() {
//     //return Goals.findOne({_id:this._id});
//     return Template.instance().detailedGoal.get();
//   }
// });

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
        modified: new Date(),
        tags: []
      }

      // alert("add code for new category creation");
      Meteor.call("createCategory", newCategory);

      $(".js-category-name-input").val("");

      template.showCategoryInput.set(false);
    },
    "click .js-detail-entry": function(event, template) {
      event.preventDefault();
          const goal = Goals.findOne({_id: this._id});
          const task = Tasks.findOne({_id: this._id});
          const text = Texts.findOne({_id: this._id});

          if (goal) {
            template.detailedGoal.set(goal);
            console.log("goal");
          } else if (task) {
            template.detailedGoal.set(task);
            console.log("task");
          } else if (text) {
            template.detailedGoal.set(text);
            console.log("text");
          }
    },

});

Template.events.onCreated(function() {
    this.showCategoryInput = new ReactiveVar(false);

    this.detailedGoal = new ReactiveVar();
});

// Template.detailed.onCreated(function() {
//     this.detailedGoal = new ReactiveVar(null);
// });
