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


      $('.js-add-entry').click(function() {
     console.log("clicked!");
     // var events = Tasks.find({createdBy: Meteor.userId()}).fetch();
     // // console.log(events);
     //  for(var i =0; i<events.length ;i++){

     //  }
                 // $('#calendar').fullCalendar( 'rerenderEvents' );


  });

  $( '#calendar' ).fullCalendar( 'refetchEvents' );


    },
    header: {
      left:   'title',
      center: '',
      right:  ''
    },
    height: 700,

    events: _.map(Tasks.find().fetch(), function(x) {
      // console.dir(x.date);
      const z = {title: x.title, start: new Date(x.date)};
      // console.dir(z);
      return z;
    }),
  });




  // $('#calendar').fullCalendar( 'rerenderEvents' );

});



Template.calendar.onCreated( function(){
  // Tasks.find().fetch();
  //   $( '#calendar' ).fullCalendar( 'refetchEvents' );
  //   $('#calendar').fullCalendar( 'rerenderEvents');
    // $('#calendar').fullCalendar('renderEvent', newEvent);

//   var events = Tasks.find({createdBy: Meteor.userId()}).fetch();
//      // console.log(events);
//       for(var i =0; i<events.length ;i++){

//         var newEvent = {
//           title: events[i].title,
//           start: moment(new Date())
//         };
//         $('#calendar').fullCalendar( 'renderEvent', newEvent, true);
//         console.log(events[i].date);
//       }

//   $('#calendar').fullCalendar( 'rerenderEvents' );

});

// $('.js-add-entry').click(function() {
//      console.log("clicked!");
//      // var events = Tasks.find({createdBy: Meteor.userId()}).fetch();
//      // // console.log(events);
//      //  for(var i =0; i<events.length ;i++){

//         var newEvent = {
//           title: "HEy",
//           start: new Date()
//         };
//         // Meteor.call('createTask', newEvent);
//         $('#calendar').fullCalendar('renderEvent', newEvent);
//         // console.log(newEvent);
//      //  }
//                  // $('#calendar').fullCalendar( 'rerenderEvents' );


//   });





// Tracker.autorun( () => {
//     var newEvent = {
//           title: "HEy",
//           start: new Date()
//         };
//         // Meteor.call('createTask', newEvent);
//         $('#calendar').fullCalendar('renderEvent', newEvent);
//     // Tasks.find().fetch();
//     // $( '#calendar' ).fullCalendar( 'refetchEvents' );
//     // $('#calendar').fullCalendar( 'rerenderEvents');
//     console.log("running autorun");
// });
