
function render(el, template) {
	return function (data) {
		function clickListener(event) {
			event.preventDefault();
			console.log('skill:', event.target.textContent);
		}
		delegate(el, {
			'click a' : clickListener
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
function products() {
	getData().then(render(el, template));
}

products();
