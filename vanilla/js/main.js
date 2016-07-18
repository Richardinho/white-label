var app = document.getElementById('app');

var router = new Router({
	'' : homeController(app)
});

function html(el, htmlString) {
	//todo should also handle case where string represents more than single root element
	// iterate through children and append each to node.
	var tempEl = document.createElement('div');
	tempEl.innerHTML = htmlString;
	el.appendChild(tempEl.firstElementChild);
}

function getTemplate(id) {
	return document.getElementById(id).textContent;
}

function addSection(el, templateId, data) {
	var bannerTemplate = getTemplate(templateId);
	html(el, TemplateEngine(bannerTemplate, data));
}

function homeController (app) {
	return function handleRequest() {

		console.log('handle controller');
		getData().then(function (model) {
			var el = document.createElement('div');
			el.className = 'container';
			app.innerHTML = '';
			delegate(el, {
				'click [data-internal-link]' : handleInternalLink
			});
			var asideEl = document.createElement('div');
			asideEl.className = 'aside';
			renderAside(asideEl, model.getRefinements());
			var mainEl = document.createElement('div');
			mainEl.className = 'content';
			addSection(el, 'banner-template', {});
			renderResults(mainEl, model.getResults());
			el.appendChild(asideEl);
			el.appendChild(mainEl);
			addSection(el, 'footer-template', {});
			app.appendChild(el);
		});
	}
}

function handleSortByToggle(event) {
	router.navigate('?sort-by=' + event.target.value);
}

function renderAside(el, refinements) {
	var asideTemplate = getTemplate('aside-template');
	html(el, TemplateEngine(asideTemplate, refinements));

	delegate(el, {
		'change [name=sort-by]' : handleSortByToggle
	});
}

function renderResults(el, results) {
	var resultTemplate = getTemplate('result-template');
	var frag = document.createDocumentFragment();
	frag = results.reduce(function (frag, resultData) {
		html(frag, TemplateEngine(resultTemplate, resultData));
		return frag;
	}, frag);
	el.appendChild(frag);
}

function getData() {
	return fetch('http://localhost:3000/api/emperors').then(function (response) {
		return response.json().then(function(json) {
			return createModel(json);
		});
	});
}

function createModel(json) {

	return {
		getRefinements : function () {
			return {};
		},
		getResults : function () {
			return json;
		},
		getPagination : function () {}
	};
}

function handleInternalLink(event) {
	event.preventDefault();
	var href = event.target.getAttribute('href');
	router.navigate(href);
}

router.start();





