Template.home.helpers({

});

Template.home.events({
    "submit .js-register": function(event) {
        event.preventDefault();

        const f = $(".js-first-name").val();
        const l = $(".js-last-name").val();
        const e = $(".js-email").val();
        const p = $(".js-password").val();

        Accounts.createUser({
          profile: {
            first: f,
            last: l
            // pic_url: ???
          },
          email: e,
          password: p
        }, function(error) {
          if(error) { // if registration fails
            console.log(error.reason); // console log reason
            return;
          } else {
            Router.go('/upcoming'); // else go to upcoming page
          }
        });
      },

});
