Template.upcoming.helpers({
  today: function() {
    return Template.instance().today.get();
  },
  tomorrow: function() {
    return Template.instance().tomorrow.get();
  },
  todoToday: function() {
    var y = Tasks.find({createdBy: Meteor.userId()}).fetch();
    var p = y.concat(Goals.find({createdBy: Meteor.userId()}).fetch());

    function isToday(p) {
      // var q = moment(p.date, "MMM Do YY").fromNow(true);
      if (moment(p.date, "MMM Do YY").format("MM-DD-YYYY") === moment(new Date(), "MMM Do YY").format("MM-DD-YYYY")) {
        return p;
      }
      // return p.time - new Date() < 86400000;
    }

    w = p.filter(isToday);

    // console.log(w);

    var x = w.sort(function(a, b) {
      if (a.createdAt > b.createdAt) {
        return -1;
      }
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      return 0;
    });
    // console.log(x);
    return x;
  },
  todoTomorrow: function() {
    var y = Tasks.find({createdBy: Meteor.userId()}).fetch();
    var p = y.concat(Goals.find({createdBy: Meteor.userId()}).fetch());

    function isTomorrow(p) {
      // only entries for tomorrow should stay (not today nor the day after tomorrow [to be fixed])
      if (moment(p.date, "MMM Do YY").format("MM-DD-YYYY") === moment().add(1, "days").format("MM-DD-YYYY")) {
        return p;
      }
    }

    w = p.filter(isTomorrow);

    // console.log(w);

    var x = w.sort(function(a, b) {
      if (a.createdAt > b.createdAt) {
        return -1;
      }
      if (a.createdAt < b.createdAt) {
        return 1;
      }
      return 0;
    });
    // console.log(x);
    return x;
  },
});

Template.upcoming.events({
  "click .js-today-tab": function(event, template) {
    event.preventDefault();

    template.today.set(true);
    template.tomorrow.set(false);
  },
  "click .js-tomorrow-tab": function(event, template) {
    event.preventDefault();

    template.tomorrow.set(true);
    template.today.set(false);
  },
});

Template.upcoming.onCreated(function() {
  this.today = new ReactiveVar(true);
  this.tomorrow = new ReactiveVar(false);
});
