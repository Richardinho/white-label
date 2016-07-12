function Router() {


}

Router.prototype = {

	navigate : function (path, options) {
		if(options && options.replace) {
			history.replaceState(path);
		} else {
			console.log('push state');
			history.pushState({page: 1}, "title 1", path);
		}
	},

	router : function () {
		console.log('run router');
	},

	start : function () {
		window.addEventListener('popstate', this.router.bind(this));
		this.router();
	}
};



