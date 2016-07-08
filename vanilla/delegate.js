function delegate(el, config) {

	Object.keys(config).forEach(function (key) {
		var listener = config[key];

		var eventSelector = splitEventFromSelector(key);

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

function splitEventFromSelector(srcString) {
	return srcString.match(/^(\S+)\s(.*)/).slice(1);
}

function convertEvent(event, currentTarget, target){
	event.target = target;
	event.currentTarget = currentTarget;
	return event;
}