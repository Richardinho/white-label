function Router(routeConfig) {
	this.routes = Object.keys(routeConfig).map(function (route) {
		return this.createRoute(route, routeConfig[route]);
	}, this);
}

Router.prototype = {

	createRoute : function (route, handler) {
		return { 'routeRegex' : this.routeToRegex(route), 'handler' : handler };
	},

	routeToRegex : function (route) {
		// stolen from Backbone!
		var optionalParam = /\((.*?)\)/g;
		var namedParam    = /(\(\?)?:\w+/g;
		var splatParam    = /\*\w+/g;
		var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

		route = route.replace(escapeRegExp, '\\$&')
			.replace(optionalParam, '(?:$1)?')
			.replace(namedParam, function(match, optional) {
				return optional ? match : '([^/?]+)';
			})
			.replace(splatParam, '([^?]*?)');
		return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
	},

	navigate : function (path, options) {
		if(options && options.replace) {
			history.replaceState(path);
		} else {
			history.pushState({page: 1}, "title 1", path);
		}
	},

	router : function () {
		var path = this.getPath();
		var route = this.routes.find(function (route) {
			return this.matchRoute(path, route.routeRegex);
		}, this);
		route.handler.apply(null, this.extractParameters(route.routeRegex, path));
	},

	extractParameters: function(route, fragment) {
		var params = route.exec(fragment).slice(1);
		return params.map(function(param, i) {
			// Don't decode the search params.
			if (i === params.length - 1) return param || null;
			return param ? decodeURIComponent(param) : null;
		});
	},

	getPath : function () {
		return (window.location.pathname + window.location.search).substring(1);  // strip leading slash
	},

	matchRoute : function (path, route) {
		return route.test(path);
	},

	start : function () {
		window.addEventListener('popstate', this.router.bind(this));
		this.router();
	}
};



