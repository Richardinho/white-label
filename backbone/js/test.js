var Router = Backbone.Router.extend({

	routes : {
		'' : 'home',
		'foo' : 'foo',
		'bar/moo' : 'barmoo'

	},
	home : function () {
		console.log('this is the home controller', arguments);

	},
	foo : function () {
		console.log('this is the foo controller');
	},
	barmoo : function () {
		console.log('this is barmoo');
	}
});

var router = new Router();

Backbone.history.start({ pushState : true });

