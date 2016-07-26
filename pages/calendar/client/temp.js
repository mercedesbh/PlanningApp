
Template.event.onCreated( () => {
  let template = Template.instance();
  template.subscribe( 'theEvents' );
});



Template.event.onRendered( () => {
  let isPast = ( date ) => {
      let today = moment().format();
      return moment( today ).isAfter( date );
  };


  $( '#events-calendar' ).fullCalendar({
      events( start, end, timezone, callback ) {
          let data = Events.find().fetch().map( ( event ) => {
            event.editable = !isPast( event.start );
            return event;
          });

          if ( data ) {
            callback( data );
          }
      },

  eventRender( event, element ) {
      element.find( '.fc-content' ).html(
        `<h4>${ event.title }</h4>
         <h5> ${event.guests}</h5>

         <p class="type-${ event.type }">#${ event.type }</p>
        `
      );
    },

    // <p class="guest-count">${ event.guests } Guests</p>


    eventDrop( event, delta, revert ) {
      let date = event.start.format();
      if ( !isPast( date ) ) {
        let update = {
          _id: event._id,
          start: date,
          end: date
        };

        Meteor.call( 'editEvent', update, ( error ) => {
          if ( error ) {
            Bert.alert( error.reason, 'danger' );
          }
        });
      } else {
        revert();
        Bert.alert( 'Sorry, you can\'t move items to the past!', 'danger' );
      }
    },


    dayClick( date ) {
      console.log(date);
      Session.set( 'eventModal', { type: 'add', date: date.format() } );
      if(){

      }else{

      }
      $( '#add-edit-event-modal' ).modal( 'show' );

      // console.log(date);
    },

    eventClick( event ) {
      Session.set( 'eventModal', { type: 'edit', event: event._id } );
      $( '#add-edit-event-modal' ).modal( 'show' );
    }


  });

 Tracker.autorun( () => {
    Events.find().fetch();
    $( '#events-calendar' ).fullCalendar( 'refetchEvents' );
  });


});



Template.addEditEventModal.helpers({
  modalType( type ) {
    let eventModal = Session.get( 'eventModal' );
    if ( eventModal ) {
      return eventModal.type === type;
    }
  },

   modalLabel() {
    let eventModal = Session.get( 'eventModal' );

    if ( eventModal ) {
      return {
        button: eventModal.type === 'edit' ? 'Edit' : 'Add',
        label: eventModal.type === 'edit' ? 'Edit' : 'Add an'
      };
    }
  },
  selected( v1, v2 ) {
    return v1 === v2;
  },

   select: function(start, end, allDay) {
    var check = $.fullCalendar.formatDate(start,'yyyy-MM-dd');
    console.log("you select"+ check);
    var today = $.fullCalendar.formatDate(new Date(),'yyyy-MM-dd');
    if(check < today)
    {
        // Previous Day. show message if you want otherwise do nothing.
                // So it will be unselectable
    }
    else
    {
        // Its a right date
                // Do something
    }
  },


  event() {
    let eventModal = Session.get( 'eventModal' );

    if ( eventModal ) {
      return eventModal.type === 'edit' ? Events.findOne( eventModal.event ) : {
        start: eventModal.date,
        end: eventModal.date
      };
    }
  }
});


Template.addEditEventModal.events({
  'submit form' ( event, template ) {
    event.preventDefault();
    let eventModal = Session.get( 'eventModal' ),
        submitType = eventModal.type === 'edit' ? 'editEvent' : 'addEvent',
        eventItem  = {
          title: template.find( '[name="title"]' ).value,
            start: template.find( '[name="start"]' ).value,
            end: template.find( '[name="end"]' ).value,
            type: template.find( '[name="type"] option:selected' ).value,
            // description: template.find( '[name="description"]' ).value,
            // guests: parseInt( template.find( '[name="guests"]' ).value, 10 )
            guests: template.find( '[name="guests"]' ).value
        };

    if ( submitType === 'editEvent' ) {
      eventItem._id   = eventModal.event;
    }

    Meteor.call( submitType, eventItem, ( error ) => {
        if ( error ) {
          Bert.alert( error.reason, 'danger' );
        } else {
          Bert.alert( `Event ${ eventModal.type }ed!`, 'success' );
          closeModal();
        }
    });

    let closeModal = () => {
      $( '#add-edit-event-modal' ).modal( 'hide' );
      $( '.modal-backdrop' ).fadeOut();
  };
  },

  'click .delete-event' ( event, template ) {
    let eventModal = Session.get( 'eventModal' );
    if ( confirm( 'Are you sure? This is permanent.' ) ) {
      Meteor.call( 'removeEvent', eventModal.event, ( error ) => {
          if ( error ) {
              Bert.alert( error.reason, 'danger' );
          } else {
              Bert.alert( 'Event deleted!', 'success' );
              closeModal();
          }
      });
    }
  }

});



// <template name="calendar">
// <div class="calendar-row">
//   <div class="calendar-row col-sm-12">
//     <div class="css-events-nav row">
//       <div class="col-sm-1"></div>
//       <div class="col-sm-11">
//         <br>
//         <br>
//         {{> event}}
//       </div>
//     </div>
//   </div>
// </div>
  
// </template>


// <template name="event">
// {{> addEditEventModal }}
//   <div id="events-calendar"></div>
//   <h2>You called event template</h2>
// </template>


// <template name="addEditEventModal">
//   <div class="modal fade" id="add-edit-event-modal" tabindex="-1" role="dialog" aria-labelledby="add-edit-event-modal">
//   <div class="modal-dialog" role="document">
//     <div class="modal-content">
//       <div class="modal-header">
//         <button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>
//         <h4 class="modal-title" id="add-edit-event">{{modalLabel.label}} Event</h4>
//       </div>
//       <form id="add-edit-event-form">
//         <div class="modal-body">
//           <div class="form-group">
//             <div class="row">
//               <div class="col-xs-12 col-sm-4">
//                 <label for="type">Event Type</label>
//                 <select name="type" class="form-control">
//                  <option selected="{{selected event.type 'Goal' }}" value="Goal">Goal</option>
//                   <option selected="{{selected event.type 'Task' }}" value="Task">Task</option>
//                   <option selected="{{selected event.type 'Reminder' }}" value="Reminder">Reminder</option>
//                   <option selected="{{selected event.type 'Note' }}" value="Note">Note</option>
//              <!--      <option selected="{{selected event.type 'Goal' }}" value="Birthday">Goal</option>
//                   <option selected="{{selected event.type 'Corporate' }}" value="Corporate">Task</option>
//                   <option selected="{{selected event.type 'Miscellaneous' }}" value="Miscellaneous">Reminder</option>
//                   <option selected="{{selected event.type 'Wedding' }}" value="Wedding">Note</option> -->
//                 </select>
//               </div>
//               <div class="col-xs-12 col-sm-3">
//                 <label for="start">Event Starts</label>
//                 <input disabled type="text" name="start" class="form-control" value="{{event.start}}">
//               </div>
//               <div class="col-xs-12 col-sm-3">
//                 <label for="end">Event End</label>
//                 <input disabled type="text" name="end" class="form-control" value="{{#if event.end}}{{event.end}}{{else}}{{event.start}}{{/if}}">
//               </div>
//             </div>
//           </div>
//           <div class="form-group">
//             <label for="title">Event Title</label>
//             <input type="text" name="title" class="form-control" value="{{event.title}}">
//           </div>
//           <div class="row">
//             <div class="col-xs-12 col-sm-4">
//               <label for="guests">Number of Guests</label>
//               <input type="text" name="guests" class="form-control" value="{{event.guests}}">
//             </div>

//            <!--  <div class="col-xs-12 col-sm-4">
//               <label for="description">Description</label>
//               <input type="text" name="description" class="form-control" value="{{event.description}}">
//             </div> -->
//           </div>
//         </div>
//         <div class="modal-footer">
//           {{#if modalType 'edit'}}
//             <button class="btn btn-danger pull-left delete-event">Delete Event</button>
//           {{/if}}
//           <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
//           <button type="submit" class="btn btn-success">{{modalLabel.button}} Event</button>
//         </div>
//       </form>
//     </div>
//   </div>
// </div>
// </template>


