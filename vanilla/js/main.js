var app = document.getElementById('app');

var router = new Router({
	'' : homeController(app)
});

function html(htmlString) {
	var tempEl = document.createElement('div');
	tempEl.innerHTML = htmlString;
	return tempEl.firstElementChild;
}

function getTemplate(id) {
	return document.getElementById(id).textContent;
}

function addSection(el, templateId, data) {
	var bannerTemplate = getTemplate(templateId);
	el.appendChild(html(TemplateEngine(bannerTemplate, data)));
}


function homeController (app) {
	return function handleRequest() {
		getData().then(function (comments) {
			var el = document.createElement('div');
			el.className = 'container';
			app.innerHTML = '';
			delegate(el, {
				'click [data-internal-link]' : handleInternalLink
			});
			var asideEl = document.createElement('div');
			asideEl.className = 'aside';
			addSection(asideEl, 'aside-template', {});
			var mainEl = document.createElement('div');
			mainEl.className = 'content';
			addSection(el, 'banner-template', {});
			addSection(mainEl, 'pagination-template', {});
			el.appendChild(asideEl);
			el.appendChild(mainEl);
			addSection(el, 'footer-template', {});
			app.appendChild(el);
		});
	}
}

function getData() {
	return fetch('http://localhost:3000/api/comments').then(function (response) {
		return response.json();
	});
}

function handleInternalLink(event) {
	event.preventDefault();
	var href = event.target.getAttribute('href');
	router.navigate(href);
}

router.start();





