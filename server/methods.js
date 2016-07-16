Meteor.methods({
  createTask: function(task) {
    Tasks.insert(task);
  },
  createGoal: function(goal) {
    Goals.insert(goal);
  },
  createText: function(text) {
    Texts.insert(text);
  },
  createCategory: function(category) {
    Meteor.users.update({_id: this.userId}, {$push: {categories: category}});
  },

});
