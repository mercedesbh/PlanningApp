Categories = new Meteor.Collection("categories");
Tasks = new Meteor.Collection("tasks");
Goals = new Meteor.Collection("goals");
Texts = new Meteor.Collection("texts");

// the Events collection is for calendar, but we might not want it, we can use collection we have to do it.
Events = new Meteor.Collection("events");


Events.allow({
  insert: () => false,
  update: () => false,
  remove: () => false
});

Events.deny({
  insert: () => true,
  update: () => true,
  remove: () => true
});

// schema rules will go here
let EventsSchema = new SimpleSchema({
  'title': {
    type: String,
    label: 'The title of this event.'
  },
  'start': {
    type: String,
    label: 'When this event will start.'
  },
  'end': {
    type: String,
    label: 'When this event will end.'
  },
  'type': {
    type: String,
    label: 'What type of event is this?',
    allowedValues: [ 'Birthday', 'Corporate', 'Wedding', 'Miscellaneous' ]
  },
  'guests': {
    type: String,
    label: 'The number of guests expected at this event.'
  }

  // 'description': {
  //   type: String,
  //   label: 'The description of the event.'
  // }
});

Events.attachSchema( EventsSchema );
