Template.calendar.helpers({

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

Template.calendar.onRendered( function() {

  $( '#calendar' ).fullCalendar({

  	dayClick: function(date) {
      const xDate = date.format();
      const minDate = moment().format("YYYY-MM-DD");
      const minDateAfter = moment().add(1, 'days').format("YYYY-MM-DD");
      // console.log(xDate + " " + minDate);
      // if ((xDate === minDate) || date > moment(new Date())) {
      if (xDate === minDateAfter || xDate === minDate || date > moment(new Date())) {
        $('#userModal').modal('show');
      } else {
        sAlert.error("Choose a day that is not in the past.");
      }

    },
    header: false,
    // contentHeight: 510,



  });
});
