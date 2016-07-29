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
    var k = Template.instance().currentCategory.get();
    if (k) {
      console.log("something");
      var o = Template.instance().currentCategory.get();
      var y = Tasks.find({createdBy: Meteor.userId(), category: o}).fetch();
      var p = y.concat(Goals.find({createdBy: Meteor.userId(), category: o}).fetch(), Texts.find({createdBy: Meteor.userId(), category: o}).fetch());
    } else {
      var y = Tasks.find({createdBy: Meteor.userId()}).fetch();
      // console.log(y);
      var p = y.concat(Goals.find({createdBy: Meteor.userId()}).fetch(), Texts.find({createdBy: Meteor.userId()}).fetch());
    }

    var x = p.sort(function(a, b) {
      if (a.createdAt < b.createdAt) {
        return -1;
      }
      if (a.createdAt > b.createdAt) {
        return 1;
      }
      return 0;
    });
    // console.log(x);
    return x;
  },
  showCategoryInput: function() {
    return Template.instance().showCategoryInput.get();
  },
  detailed: function() {
    //return Goals.findOne({_id:this._id});
    return Template.instance().detailed.get();
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
            template.detailed.set(goal);
            console.log("goal");
          } else if (task) {
            template.detailed.set(task);
            console.log("task");
          } else if (text) {
            template.detailed.set(text);
            console.log("text");
          }
    },
    "click #js-event-category": function(event, template) {
      event.preventDefault();

      var f = $(this).val($(this).text())[0].name;
      // console.log(f);
      template.currentCategory.set(f);
    },

});

Template.events.onCreated(function() {
    this.showCategoryInput = new ReactiveVar(false);
    this.detailed = new ReactiveVar(firstEntry());
    this.currentCategory = new ReactiveVar();
});
