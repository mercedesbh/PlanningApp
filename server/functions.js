Accounts.onCreateUser(function(user) {

  const defaultCategory = {
    owner: Meteor.userId(),
    name: "To-Do",
    tasks: [],
    goals: [],
    text: [],
    createdAt: new Date(),
    modified: new Date()
  }

  user.categories = defaultCategory;
  user.joined = new Date();

  return user;
});
