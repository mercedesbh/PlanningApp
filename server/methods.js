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
  linkTask: function(lastEntry, category) {
    var x = Meteor.users.find({_id: this.userId}).fetch()[0].categories;
    for (var i = 0; i < x.length; i++) {
      if (x[i].name == category) {
        var y = x[i].tasks;
        y.push(lastEntry);
        // console.log(x);
        Meteor.users.update({_id: this.userId}, {$set: {"categories": x}});
      }
    }

    // console.log(Meteor.users.find({_id: this.userId}).fetch()[0].categories[0]);

  },
  addTag: function(category, tag) { // Meteor.call("addTag", tCategory, tTagObj);
    var c = Meteor.users.find({_id: this.userId}).fetch()[0].categories;
    for (var i = 0; i < c.length; i++) {
      if (c[i].name == category) {
        var b = c[i].tags;
        console.log(b);
        b.push(tag);
        console.log(b);
        console.log(c);
        Meteor.users.update({_id: this.userId}, {$set: {"categories": c}});
      }
    }
  },
});
