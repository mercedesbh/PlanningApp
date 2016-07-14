Meteor.subscribe("theTasks");
Meteor.subscribe("theGoals");
Meteor.subscribe("theTexts");
Meteor.subscribe("theCategories");

Template.layout.helpers({
    userName: function() {
        const liveUser = Meteor.userId();
        return Meteor.users.findOne({
            _id: liveUser
        });
    },
    link: function() {
        if (Router.current().route.path() == "/events") {
            return "Upcoming";
        } else if (Router.current().route.path() == "/upcoming" || Router.current().route.path() == "/") {
            return "Events";
        }
    }
});

Template.layout.events({
    "click .js-logout": function() {
        event.preventDefault();

        Meteor.logout();
        Router.go('/');
    },
    "click .js-smart-link": function() {
        event.preventDefault();

        if (Router.current().route.path() == "/events") {
            Router.go("/upcoming");
        } else if (Router.current().route.path() == "/upcoming" || Router.current().route.path() == "/") {
            Router.go("/events");
        }

        // alert(Router.current().route.path());
    },
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
    "click .js-add-entry": function(event) {
        event.preventDefault();

        if ($(".js-modal-select").val() == "task") {

            const tTitle = $(".js-task-title").val();
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

            const gTitle = $("js-goal-title").val();
            const gDateS = $("js-goal-date-s").val();
            const gDateF = $("js-goal-date-f").val();
            var gLocation = $("js-goal-location").val();
            var gNote = $("js-goal-note").val();

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
});

Template.modal.onRendered(function() {
    this.$('.datetimepicker5').datetimepicker();
    this.$('.datetimepicker6').datetimepicker();
});
