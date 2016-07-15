Accounts.onCreateUser(function(user) {

  // user.categories = [];


  const categories = [{
    name: "To-Do",
    tasks: [],
    goals: [],
    text: [],
    createdAt: new Date(),
    modified: new Date()
  }];





  // Meteor.call("insertDefault", defaultCategory);

  user.categories = categories;
  user.joined = new Date();

  return user;
});
