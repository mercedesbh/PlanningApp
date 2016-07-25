
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
      Session.set( 'eventModal', { type: 'add', date: date.format() } );
      $( '#add-edit-event-modal' ).modal( 'show' );
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
            guests: parseInt( template.find( '[name="guests"]' ).value, 10 )
            // guests: template.find( '[name="guests"]' ).value
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

