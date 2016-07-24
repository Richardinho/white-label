(function () {

	"use strict";
	//  promote to string utils file

	var dom = {
		//  wrapper for querySelector()
		$ : function(selector, context) {
			return (context || document).querySelector(selector);
		},
		//  wrapper for querySelectorAll()
		$$ : function () {},

		/*
			Get the immediately preceding sibling of each
			element in the set of matched elements.
			If a selector is provided, it retrieves the previous
			 sibling only if it matches that selector.
		*/
		prev : function (el, selector) {
			var prevSibling = el.previousElementSibling;
			return prevSibling && dom.matches(prevSibling, selector) ? prevSibling : null;
		},

		next : function (el, selector) {
			var nextSibling = el.nextElementSibling;
			return nextSibling && dom.matches(nextSibling, selector) ? nextSibling : null;
		},

		parent : function (el, selector) {
			var parent = el.parentNode;
			return parent && dom.matches(parent, selector) ? parent : null;
		},

		matches : function (elm, selector) {
			var matches = (elm.document || elm.ownerDocument).querySelectorAll(selector),
					i = matches.length;
			while (--i >= 0 && matches.item(i) !== elm) {}
			return i > -1;
		},

		insertAfter : function (newEl, referenceEl) {

			var parentEl = referenceEl.parentElement;
			var nextSibling = referenceEl.nextElementSibling;
			// if next sibling is null, insertBefore will insert newEl as the last child of the parent.
			parentEl.insertBefore(newEl, nextSibling)
		},

		//  condition is either a selector string or a function as per strategy pattern
		searchAncestors : function (descendant, condition, ancestor){
			var parent = descendant.parentNode,
			    conditionFunc;

			if(sundry.isString(condition)) {
				conditionFunc = function (el) {
					return dom.matches(el, condition);
				}
			} else if(sundry.isFunction(condition)) {
				conditionFunc = condition;
			} else {
				throw {
					message : 'condition must be a string or a function'
				}
			}

			if(conditionFunc(descendant)) {
				return descendant;
			} else if(parent === null) {
				return false;
			} else if(parent === ancestor) {
				return conditionFunc(parent) ? parent : false;
			} else {
				return dom.searchAncestors(parent, condition, ancestor);
			}
		},

		delegate : function (el, eventType, targetSelector, handler, context) {
			if(context) {
				handler = handler.bind(context);
			}
			el.addEventListener(eventType, function (event){
				// are we on the element the handler is attached to?
				if(event.target === event.currentTarget) {
					handler(event);
					return;
				}
				var target = dom.searchAncestors(event.target, targetSelector, event.currentTarget);
				if(target) {
					// how to create synthetic event as if it occurred on this target?
					handler({
						target : target,
						currentTarget: el,
						preventDefault : event.preventDefault.bind(event), // delegates to original event object
						stopPropagation : event.stopPropagation.bind(event),
						which : event.which,
						originalEvent : event
					});
				}
			});
		},

		nthChild : function (el, index) {
			return el.children[index];
		}
	};

	//  https://github.com/requirejs/requirejs/wiki/Updating-existing-libraries#anon
	if ( typeof define === "function" && define.amd ) {
		define(function() {
			return dom;
		});
	} else if (typeof module === "object" && module && typeof module.exports === "object") {
		module.exports = dom;
	} else if(typeof window === "object") {
		window.domutils = dom;
	}

})();


