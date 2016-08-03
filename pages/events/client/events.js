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
  priorityNeutral: function(priority) {
    console.log(priority);
    if (priority === "<span style='color: #666666'>Neutral</span>") {
      return true;
    } else {
      return false;
    }
  },
  priorityImportant: function(priority) {
    if (priority === "<span style='color: #0c59cf'>Important</span>") {
      return true;
    } else {
      return false;
    }
  },
  priorityUrgent: function(priority) {
    if (priority === "<span style='color: #e61610'>Urgent</span>") {
      return true;
    } else {
      return false;
    }
  },
  isEdit: function() {
    // console.log(Session.get("isEdit"));
    return Session.get("isEdit");
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
    "click .js-edit-entry": function(event) {
      event.preventDefault();
      console.log(this);
      console.log(event.currentTarget.innerHTML);

      Session.set("isEdit", true);
      Session.set("editThis", this);

      $(function() {
        $('#datetimepicker3').datetimepicker({
          minDate: this.start
        });
      });
    },
    "click .js-save-edit": function(event) {
      event.preventDefault();

      const f = $(".js-edit-title").val();
      const g = $(".js-edit-priority").val();
      const h = $(".js-edit-date-time").val();
      const j = $(".js-edit-note").val();

      const editObj = {
        title: f,
        priority: g,
        start: h,
        time: moment(h).format('h:mm A'),
        date: moment(h).format('MMM Do YY'),
        note: j
      }

      var item = this._id;
      // console.log(item);

      Meteor.call("editEntry", item, editObj);
      Session.set("isEdit", false);
    },
    "click .js-cancel-edit": function(event) {
      event.preventDefault();

      Session.set("isEdit", false);
    },

});

// "click .js-edit-entry": function(event, template) {
//   event.preventDefault();
//   console.log(this);
//   console.log(event.currentTarget.innerHTML);
//
//
//   Session.set("isEdit", true);
//   // console.log(Template.instance().isEdit.get());
//   Session.set("editThis", this);
//   // console.log(Template.instance().edit.get().title);
//   $('#userModal').modal('show');
//
// },

// editThis: function() {
//   // console.log(Session.get("editThis"));
//   return Session.get("editThis");
// },
// isEdit: function() {
//   // console.log(Session.get("isEdit"));
//   return Session.get("isEdit");
// },

Template.events.onCreated(function() {
    this.showCategoryInput = new ReactiveVar(false);
    this.detailed = new ReactiveVar(firstEntry());
    this.currentCategory = new ReactiveVar();
});
