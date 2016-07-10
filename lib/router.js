Router.configure({
    layoutTemplate: 'layout',
});

Router.route('/', {name: 'home'});
Router.route('/login', {name: 'login'});
Router.route('/upcoming', {name: 'upcoming'});
Router.route('/events', {name: 'events'});

var requireLogin = function() {
		// if the user is not logged in...
    if (!Meteor.userId()) {
        // ...render the home template in order to login
        this.render('login');
    } else {
        // otherwise continue
        this.next();
    }
};

var loggedIn = function() {
  if (Meteor.userId()) {
    this.render('upcoming');
  } else {
    this.next();
  }
};

Router.onBeforeAction(requireLogin, {
		// the only pages that don't require logged in user are:
    except: ['login', 'home']
});

Router.onBeforeAction(loggedIn, {
		// the only pages that don't require logged in user are:
    except: ['upcoming', 'events']
});
