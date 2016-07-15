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
                Session.set("highlight", "css-current-local");
                Router.go("/upcoming");
            }
        });
    },
});
