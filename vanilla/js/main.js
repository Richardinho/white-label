var router = new Router({
	'orange/:kind' : orangeController,
	'apple/:kind' : appleController
});

function appleController(kind) {
	var el = document.getElementById('app');
	var template = document.getElementById('my-template').textContent;
	getData(kind).then(render(el, template));
}

function orangeController(kind) {
	var el = document.getElementById('app');
	var template = document.getElementById('my-template').textContent;
	getData(kind).then(render(el, template));
}

function handleInternalLink(event) {
	event.preventDefault();
	var href = event.target.getAttribute('href');
	router.navigate(href);
}

function render(el, template) {
	return function (data) {
		delegate(el, {
			'click [data-internal-link]' : handleInternalLink
		});
		el.innerHTML = TemplateEngine(template, data);
	}
}

function getData(query) {

	var data = {
		mackintosh : {
			name : 'Apple Mackintosh'
		},
		goldenDelicious : {
			name : 'Golden Delicious'
		},
		grannySmith : {
			name : 'Granny Smith'
		},
		clementine : {
			name : 'Clementine'
		}
	};
	return new Promise(function (resolve, reject) {
		resolve(data[query]);
	});
}

router.start();





