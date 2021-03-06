Accounts.onCreateUser(function(options, user) {

  // think about generation you own _id
  // with the Random package so you can
  // set owner in the default category

  // const rID = Random.id;
  // console.log(rID);
  // user._id = rID;

  user.notifications = [];
  user.categories = [];
  user.profile = {
    first: options.first,
    last: options.last
  };
  user.collaborators = [];
  user.locations = [];
  const userCategories = [{
    name: "To-Do",
    tasks: [],
    goals: [],
    text: [],
    // owner: ???,
    createdAt: new Date(),
    modified: new Date(),
    tags: []
  }];

  user.categories = userCategories;
  user.joined = new Date();
  user.settings = {
    remindDistance: 1,
    remindTime: 5
  };

  return user;
});
