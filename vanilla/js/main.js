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
	return function handleRequest(queryString) {

		getData(queryString).then(function (model) {
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

			var simple = new SelectionBox('#simple-styling');

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
		'change #simple-styling' : handleSortByToggle
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

function getData(queryString) {

	return fetch('http://localhost:3000/api/emperors' + '?' + queryString).then(function (response) {
		return response.json().then(function(json) {
			return createModel(json, queryString);
		});
	});
}

function getQueryParams(queryString) {
	//  http://stevenbenner.com/2010/03/javascript-regex-trick-parse-a-query-string-into-an-object/
	var queryParams = {};

	queryString.replace(
	    new RegExp("([^?=&]+)(=([^&]*))?", "g"),
	    function($0, $1, $2, $3) { queryParams[$1] = $3; }
	);
	return queryParams;
}

function createModel(json, queryString) {
	var queryParams;
	if(queryString) {
		queryParams = getQueryParams(queryString);
	}
	return {
		getRefinements : function () {
			//  get refinements from query string
			return {
				sortBy : queryParams && queryParams['sort-by'] ? queryParams['sort-by'] : 'reign'
			};
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





