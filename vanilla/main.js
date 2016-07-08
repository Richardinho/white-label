crossroads.addRoute('foo');
crossroads.addRoute('lorem/ipsum');
crossroads.routed.add(console.log, console); //log all routes

//setup hasher
function parseHash(newHash, oldHash){
  crossroads.parse(newHash);
}
hasher.initialized.add(parseHash); //parse initial hash
hasher.changed.add(parseHash); //parse hash changes
hasher.init(); //start listening for history change

//update URL fragment generating new history record
hasher.setHash('lorem/ipsum');

function delegate(el, config) {

	Object.keys(config).forEach(function (key) {
		var listener = config[key];

		var eventSelector = key.match(/^(\S+)\s(.*)/).slice(1);

		var event = eventSelector[0];
		var selector = eventSelector[1];

		el.addEventListener(event, function (event) {
			var target = event.target;

			while(target !== el) {
					if (target.matches(selector)) {
						listener(convertEvent(event, target, event.target))
					}
					target = target.parentNode
				}
		});
	});
}

function convertEvent(event, currentTarget, target){
	event.target = target;
	event.currentTarget = currentTarget;
	return event;
}

function render(appEl) {
	return function (data) {
		function clickListener(event) {
			event.preventDefault();
			console.log('hello', event.target, event.currentTarget);
		}
		var el = document.createElement('div');
		el.innerHTML = '<div class="foo"><div><a href="#">' + data.alpha  + '</a></div></div>';
		delegate(el, {
			'click .foo div [href]' : clickListener
		});
		appEl.innerHTML = '';
		appEl.appendChild(el);
	}
}

routes = {
	'products:param' : 'products',
	'filters:param' : 'filters'
}

function queryString() {

}

function getData() {

	return new Promise(function (resolve, reject) {
		resolve({
			alpha : 'alpha'
		});
	});
}

function products() {
	getData(queryString()).then(render(document.body));
}

products();
