
function handleInternalLink(event) {
	event.preventDefault();
	var href = event.target.getAttribute('href');
	navigate(href);
}

function render(el, template) {
	return function (data) {
		delegate(el, {
			'click [data-internal-link]' : handleInternalLink
		});
		el.innerHTML = TemplateEngine(template, data);
	}
}

function getData() {
	return new Promise(function (resolve, reject) {
		resolve({
			name : 'Richard',
			showSkills : true,
			skills : [
			  'html', 'js', 'art', 'business'
			]
		});
	});
}

var el = document.getElementById('app');
var template = document.getElementById('my-template').textContent;

getData().then(render(el, template));

startRouter();





