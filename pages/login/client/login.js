Template.login.helpers({

});

Template.login.events({
    "submit .js-login": function() {
        event.preventDefault();

        const e = $(".js-email-login").val();
        const p = $(".js-password-login").val();

        Meteor.loginWithPassword(e, p, function(error) {
            if (error) {
                event.preventDefault();

                console.log(error.reason); // // console log reason [show display error to user]
                return;
            } else {
                Router.go("/upcoming");
                notification();
                Session.setPersistent("numOfNotifications", Meteor.users.findOne({_id: Meteor.userId()}).notifications.length);
                // console.log(k);
                // sAlert.info('Welcome back!');
            }
        });
    },
});
