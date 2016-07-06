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
                            },
                            email: e,
                            password: p
                        }),

                    function(error) {
                        if (error) { // if registration fails
                            console.log(error.reason); // console log reason [show display error to user]
                            return;
                        } else {
                            Router.go('/'); // else go to ??? page
                        }

                        alert("You're registered!");
                    }
                }
                    });
