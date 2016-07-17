var Router = Backbone.Router.extend({

	routes : {
		//'' : 'home',
		'search/(:query)/p:page' : 'barmoo'

	},
	home : function () {
		console.log('this is the home controller', arguments);

	},
	foo : function () {
		console.log('this is the foo controller');
	},
	barmoo : function () {
		console.log('this is barmoo', arguments);
	}
});

var router = new Router();

Backbone.history.start({ pushState : true });

