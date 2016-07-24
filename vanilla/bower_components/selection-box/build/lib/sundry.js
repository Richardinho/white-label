(function () {

	var sundry = {

		toArray : function (arrayLike){
			return Array.prototype.slice.call(arrayLike);
		},

		isString : function (val) {
			return typeof val === 'string';
		},

		isFunction : function (val) {
			return typeof val === 'function';
		},

		extend : function (target) {

			var srcObjects = Array.prototype.slice.call(arguments, 1);
			srcObjects.forEach(function (src) {
				Object.keys(src).forEach(function(key){
					target[key] = src[key];
				})
			});
			return target;
		}

	};

	//  https://github.com/requirejs/requirejs/wiki/Updating-existing-libraries#anon
	if ( typeof define === "function" && define.amd ) {
		define(function() {
			return sundry;
		});
	} else {
		window.sundry = sundry;
	}

})();