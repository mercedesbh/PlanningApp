Template.layout.helpers({
    userName: function() {
        const liveUser = Meteor.userId();
        return Meteor.users.findOne({
            _id: liveUser
        });
    }
});

Template.layout.events({
    "click .js-logout": function() {
        event.preventDefault();

        Meteor.logout();
        Router.go('/');
    },

    "click .js-more-btn": function() {
        event.preventDefault();

        $(".css-side-nav").animate({
            left: "+=300"
        }, 1000, function() {
            // Animation complete.
        });

    },

    // $("#clickme").click(function() {
    //     $("#book").animate({
    //         opacity: 0.25,
    //         left: "+=50",
    //         height: "toggle"
    //     }, 5000, function() {
    //         // Animation complete.
    //     });
    // });
});
