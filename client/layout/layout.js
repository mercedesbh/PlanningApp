Meteor.subscribe("theTasks");
Meteor.subscribe("theGoals");
Meteor.subscribe("theTexts");
Meteor.subscribe("theCategories");

// MUST BE REMOVED BEFORE PRODUCTION STAGE
Deps.autorun(function () {
  Meteor.subscribe("theUsers");
});
// END

Template.layout.helpers({
    userName: function() {
        const liveUser = Meteor.userId();
        return Meteor.users.findOne({
            _id: liveUser
        });
    },
    // highlightUpcoming: function() {
    //   return Session.get("highlight");
    // },
    // highlightEvents: function() {
    //   return Session.get("highlight");
    // },
    // highlightCalendar: function() {
    //   return Session.get("highlight");
    // },
    // highlightSearch: function() {
    //   return Session.get("highlight");
    // },

});

Template.layout.events({
    "click .js-logout": function() {
        event.preventDefault();

        Meteor.logout();
        Router.go('/');
    },
    // "click .css-sidenav-upcoming": function() {
    //   Session.set("highlightUpcoming", "css-current-local");
    //   Session.set("highlightEvents", "");
    //   Session.set("highlightCalendar", "");
    //   Session.set("highlightSearch", "");
    // },
    // "click .css-sidenav-events": function() {
    //   Session.set("highlightUpcoming", "");
    //   Session.set("highlightEvents", "css-current-local");
    //   Session.set("highlightCalendar", "");
    //   Session.set("highlightSearch", "");
    // },
    // "click .css-sidenav-calendar": function() {
    //   Session.set("highlightUpcoming", "");
    //   Session.set("highlightEvents", "");
    //   Session.set("highlightCalendar", "css-current-local");
    //   Session.set("highlightSearch", "");
    // },
    // "click .css-sidenav-search": function() {
    //   Session.set("highlightUpcoming", "");
    //   Session.set("highlightEvents", "");
    //   Session.set("highlightCalendar", "");
    //   Session.set("highlightSearch", "css-current-local");
    // },

});

Template.modal.helpers({
    taskChosen: function() {
        return Template.instance().taskChosen.get();
    },
    goalChosen: function() {
        return Template.instance().goalChosen.get();
    },
    textChosen: function() {
        return Template.instance().textChosen.get();
    },
    map: function() {
      return Template.instance().map.get();
    },
});


Template.modal.events({
    "change .js-modal-select": function(event, template) {
        if ($(event.target).val() == "task") {
            template.taskChosen.set(true);
            template.goalChosen.set(false);
            template.textChosen.set(false);
        } else if ($(event.target).val() == "goal") {
            template.taskChosen.set(false);
            template.goalChosen.set(true);
            template.textChosen.set(false);
        } else if ($(event.target).val() == "text") {
            template.taskChosen.set(false);
            template.goalChosen.set(false);
            template.textChosen.set(true);
        }
    },
    "keypress .js-task-location": function(event, template){
      template.map.set(true);
    },
    "blur .js-task-location": function(event, template){
      if ($(".js-task-location").val() == 0){
        template.map.set(false);
      }
    },
    "click .js-add-entry": function(event) {
        event.preventDefault();

        if ($(".js-modal-select").val() == "task") {

            const tTitle = $(".js-task-title").val();
            console.log($(".js-task-title").val());

            const tDate = $(".js-task-date").val();
            var tLocation = $(".js-task-location").val();
            var tNote = $(".js-task-note").val();

            if (tLocation == "") {
                tLocation = null;
            }
            if (tNote == "") {
                tNote = null;
            }

            // alert(tDate);

            const newTask = {
                title: tTitle,
                date: tDate,
                location: tLocation,
                note: tNote,
                createdAt: new Date(),
                createdBy: Meteor.userId(),
                modified: new Date(),
                completed: false
                    // isGoal: ???
                    // reminder: ???
                    // tag: ???
                    // priority: ???
                    // repeat: ???
            }

            alert("task");

            Meteor.call("createTask", newTask);

            $(".js-task-title").val("");
            $(".js-task-date").val("");
            $(".js-task-location").val("");
            $(".js-task-note").val("");


        } else if ($(".js-modal-select").val() == "goal") {

            const gTitle = $(".js-goal-title").val();
            const gDateS = $(".js-goal-date-s").val();
            const gDateF = $(".js-goal-date-f").val();
            var gLocation = $(".js-goal-location").val();
            var gNote = $(".js-goal-note").val();

            if (gLocation == "") {
                gLocation = null;
            }
            if (gNote == "") {
                gNote = null;
            }

            const newGoal = {
                title: gTitle,
                start_date: gDateS,
                finish_date: gDateF,
                location: gLocation,
                note: gNote,
                createdAt: new Date(),
                createdBy: Meteor.userId(),
                modified: new Date(),
                completed: false,
                tasks: []
                    // isGoal: ???
                    // reminder: ???
                    // tag: ???
                    // priority: ???
                    // repeat: ???
            }

            alert("goal");

            Meteor.call("createGoal", newGoal);

            $("js-goal-title").val("");
            $("js-goal-date-s").val("");
            $("js-goal-date-f").val("");
            $("js-goal-location").val("");
            $("js-goal-note").val("");

        } else if ($(".js-modal-select").val() == "text") {

            const txtTitle = $(".js-text-title").val();
            const txtText = $(".js-text-text").val();

            const newText = {
                title: txtTitle,
                text: txtText,
                createdAt: new Date(),
                createBy: Meteor.userId(),
                modified: new Date()
                    // reminder: ???
                    // notes [???]
            }

            alert("text");
            Meteor.call("createText", newText);

            $(".js-text-title").val("");
            $(".js-text-text").val("");
        }

        $('.modal').modal('hide');
    },

});

Template.modal.onCreated(function() {
    this.taskChosen = new ReactiveVar(true);
    this.goalChosen = new ReactiveVar(false);
    this.textChosen = new ReactiveVar(false);
    this.map = new ReactiveVar(false);
});

Template.modal.onRendered(function() {
    this.$('.datetimepicker5').datetimepicker();
    this.$('.datetimepicker6').datetimepicker();

});
