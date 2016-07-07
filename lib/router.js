Router.configure({
	layoutTemplate: 'layout',
});

Router.route('/', {name: 'home'});
Router.route('/login', {name: 'login'});
Router.route('/upcoming', {name: 'upcoming'});
Router.route('/events', {name: 'events'});
