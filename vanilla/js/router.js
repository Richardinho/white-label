
function router() {
	console.log('run router');
}

function navigate(path, options) {
	if(options && options.replace) {
		history.replaceState(path);
	} else {
		console.log('push state');
		history.pushState({page: 1}, "title 1", path);
	}
}

function onpopstate() {
	console.log('popstate');
	router();
}

function startRouter() {
	window.addEventListener('popstate', onpopstate);
	router();
}


