Template.calendar.helpers({
  // calendarItem: function() {
  //   console.log(Session.get("info"));
  //   return Session.get("info");
  // },

});

Template.entryInfo.helpers({
  calendarItem: function() {
    // console.log(Session.get("info"));
    return Session.get("info");
  },
});

Template.calendar.events({
    "click .css-calendar-prev": function(event) {
        event.preventDefault();

        $('#calendar').fullCalendar('prev');
    },
    "click .css-calendar-next": function(event) {
        event.preventDefault();

        $('#calendar').fullCalendar('next');
    },
});

Template.calendar.onRendered(function(event, template) {
  this.autorun(function(event, template) {
    $('#calendar').fullCalendar({
        dayClick: function(date) {
            const xDate = date.format();
            const minDate = moment().format("YYYY-MM-DD");
            const minDateAfter = moment().add(1, 'days').format("YYYY-MM-DD");
            // console.log(xDate + " " + minDate);
            if (xDate === minDateAfter || xDate === minDate || date > moment(new Date())) {
                $('#userModal').modal('show');
            } else {
                sAlert.error("Choose a day that is not in the past.");
            }
        },
        eventClick: function(calEvent, jsEvent, view) {

          const infoObj = {
            id: calEvent._id,
            title: calEvent.title,
            tag: calEvent.tag,
            tagColor: calEvent.tagColor,
            priority: calEvent.priority,
            time: calEvent.time,
            date: calEvent.date,
            category: calEvent.category,
            completed: calEvent.completed,
          }

          // console.log(infoObj);

          Session.set("info", infoObj);
          // console.log(calEvent);
          // console.log(jsEvent);
          // console.log(view);
          $('#js-calendar-modal').modal('show');


        },
        header: {
            left: 'title',
            center: '',
            right: ''
        },
        events: _.map(Tasks.find({createdBy: Meteor.userId()}).fetch(), function(x) {
            // console.dir(x.date);
            const z = {
                title: x.title,
                start: new Date(x.start),
                _id: x._id,
                tag: x.tag,
                tagColor: x.tagColor,
                priority: x.priority,
                time: x.time,
                date: x.date,
                category: x.category,
                completed: x.completed
            };
            // console.dir(z);
            return z;
        }),
        height: 700,

    });

  }); // this
});

Tracker.autorun(function() {
  var x = Tasks.find().fetch();

  $('#calendar').fullCalendar('refetchEvents');
  $('#calendar').fullCalendar('rerenderEvents');
});
