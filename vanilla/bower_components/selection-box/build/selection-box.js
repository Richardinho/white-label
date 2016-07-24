(function(root, factory) {

	if (typeof define === 'function' && define.amd) {
		define(['domutils', 'sundry'], function(utils, sundry) {
			return factory(utils, sundry);
		});
	} else if (typeof exports !== 'undefined') {
		exports = factory(require('dom-utils'), require('sundry'));
	} else {
		root.SelectionBox = factory(root.domutils, root.sundry);
	}

})(window, function(domutils, sundry) {

	'use strict';


	var RETURN = 13,
	    TAB    = 9,
	    ESCAPE = 27,
	    UP     = 38,
	    DOWN   = 40,
	    SPACE  = 32;

	var optionSelector      = '.option',
	    displayAreaSelector = '.display-area',
	    optionListSelector  = '.option-list',
	    optionGroupSelector = '.option-group';

	/*
		todo: multiselect support
		autocomplete maybe?
	*/
	function SelectionBox(selectEl, options){

		if( !(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) ) {

			//  only work on desktop
			//  use native for mobile devices

			this.defaults = {
				            ariaEnabled : true,
				           renderOption : function (text) { return text; },
				      renderDisplayArea : function(text, value) { return text; },
				         hideFoundation : true,
				    optionListMaxHeight : 150
			};

			this.config = sundry.extend({}, this.defaults, options || {});

			this.select = domutils.$(selectEl);

			if(!this.select) {
				throw {
					name : 'NO_SELECT_ELEMENT',
					message : 'You need to supply an existing select element'
				};
			}
			this.id = this.select.id;
			this.el = this.render(this.select);

			if(this.config.hideFoundation) {
				this.select.style.display = 'none';
			}
			domutils.insertAfter(this.el, this.select)

			this.el.style.display = 'block';

			this.bindHandlers();
		}
	}

	SelectionBox.prototype = {

		//  only function that is intended to be called from outside
		//  re-renders option list
		update : function() {
			var optionList = domutils.$(optionListSelector, this.el);
			//  clear out contents
			optionList.innerHTML = '';
			this._renderOptions($optionList);
		},

		bindHandlers : function () {

			var self = this;

			// handle events on display area
			domutils.delegate(this.el,'click', displayAreaSelector, this._displayClickHandler, this);
			domutils.delegate(this.el,'keyup', displayAreaSelector, this._displayKeyUpHandler, this);

			//  handle events on options
			domutils.delegate(this.el, 'click', optionSelector, this._optionClickHandler, this);
			domutils.delegate(this.el, 'keyup', optionSelector, this._optionKeyUpHandler, this);

			//  effectively disable keydown and keypress
			domutils.delegate(this.el, 'keydown', optionSelector, function (event) {
				event.preventDefault();
			});
			domutils.delegate(this.el, 'keypress', optionSelector, function (event) {
				event.preventDefault();
			});
			// attach window event handler
			window.addEventListener('click', function (event) {
				if(!self.el.contains(event.target)) {
					self._closeOptionList();
				}
			});
			//  handle change events on foundation select
			this.select.addEventListener('change', this._handleFoundationSelectChange.bind(this));

			//  because PhantomJS doesn't support MutationObserver!!
			if(typeof MutationObserver !== 'undefined') {

				//  handle mutation events on original select box
				var observer = new MutationObserver(function(mutations) {
					self.update();
				});
				// configuration of the observer:
				var config = { childList: true };
	      // pass in the target node, as well as the observer options
	      observer.observe(this.select, config);
      }
		},

		//  handlers

		_displayClickHandler : function () {
			if(!this.select.disabled) {
				if(this.el.getAttribute('data-state') == 'closed') {
					this._openOptionList();
				} else {
					this._closeOptionList();
				}
			}
		},

		_displayKeyUpHandler : function (event) {
			if(!this.select.disabled) {
				switch(event.which) {
				case  UP:
				case DOWN :
					this._openOptionList();
					break;
				default :
					//  do something else
				}
			}
		},

		_optionClickHandler : function (event) {
			var optionEl = event.target;
			var a = !optionEl.classList.contains('__disabled');
			var b = !optionEl.parentElement.classList.contains('__disabled');
			if(a && b ) {
				this._selectValue(optionEl);
			}
		},

		_optionKeyUpHandler : function (event) {
			var option = event.target;

			switch(event.which) {
			case  UP:
				this._focusOnPreviousOption(option);
				break;
			case DOWN :
				this._focusOnNextOption(option);
				break;
			case SPACE :
			case RETURN :
				this._selectValue(option);
				break;
			case ESCAPE :
				this._closeOptionList();
				domutils.$(displayAreaSelector, this.el).focus();
				break;
			default :
				//  do nothing.
			}
		},

		_handleFoundationSelectChange : function(event) {
			this._changeSelected(this._getCurrentSelected(), this._getOptionByIndex(event.target.selectedIndex));
		},

		//  end of handlers

		//  set value on foundation select
		//  this component will update via it's listener on the foundation select.
		_selectValue : function(optionEl) {

			var value = optionEl.getAttribute('data-value') || optionEl.textContent;

			//  set value back on original select
			this.select.value = value;

			var event = document.createEvent('Event');
      event.initEvent('change', true, true);
      this.select.dispatchEvent(event);
		},

		//  performs actual change on this component, e.g changing aria values etc.
		_changeSelected : function(currentSelected, newSelected) {

			if(this.config.ariaEnabled) {
				currentSelected.setAttribute('aria-selected', false);
				newSelected.setAttribute('aria-selected', true);
			}

			currentSelected.classList.remove('__selected');
			newSelected.classList.add('__selected');

			domutils.$(displayAreaSelector, this.el).remove();
			this.el.insertBefore(this._renderDisplayArea(), this.el.firstChild  )

			domutils.$(displayAreaSelector, this.el).focus();

			this._closeOptionList();
		},

		_openOptionList : function () {
			var optionList = domutils.$(optionListSelector, this.el);
			var displayArea = domutils.$(displayAreaSelector, this.el);
			this.el.setAttribute('data-state', 'open');

			if(this.config.ariaEnabled) {
				optionList.setAttribute('aria-hidden', false);
			}

			this._positionOptionList(displayArea, optionList);

			//  focus on currently selected option
			var selectedIndex = this.select.selectedIndex;
			this.el.querySelectorAll(optionSelector)[selectedIndex].focus();
		},

		_closeOptionList : function () {
			var optionList = domutils.$(optionListSelector, this.el);
			if(this.config.ariaEnabled) {
				optionList.setAttribute('aria-hidden', true);
			}
			this.el.setAttribute('data-state', 'closed');
		},

		_focusOn : function(el) {
			el.focus();
		},

		_focusOnPreviousOption : function(option) {
			var prevOption = domutils.prev(option, optionSelector);
			if(prevOption) {
				//  if there is a previous option and it isn't disabled, focus on it. Otherwise recursively call this function
				if(prevOption.classList.contains('__disabled')) {
					this._focusOnPreviousOption(prevOption);
				} else {
					this._focusOn(prevOption);
				}
			} else if(domutils.parent(option, optionGroupSelector)) {
				//  if option is in a group, try a previous group
				var parent = domutils.parent(option, optionGroupSelector);
				var prevGroup = this._getPrevGroup(parent);
				if(prevGroup) {
					prevOption = _toArray(prevGroup.querySelectorAll(optionSelector)).pop();
					if(prevOption){
						if(!prevOption.classList.contains('__disabled')) {
							this._focusOn(prevOption);
						} else {
							this._focusOnPreviousOption(prevOption);
						}
					}
				}
			};
		},

		_focusOnNextOption : function(option) {
			var nextOption = domutils.next(option, optionSelector);
			if(nextOption) {
				if(nextOption.classList.contains('__disabled')) {
					this._focusOnNextOption(nextOption);
				} else {
					this._focusOn(nextOption);
				}
			} else if(domutils.parent(option, optionGroupSelector)) {
				var parent = domutils.parent(option, optionGroupSelector);
				var nextGroup = this._getNextGroup(parent);
				if(nextGroup) {
					var nextOption = _toArray(nextGroup.querySelectorAll(optionSelector)).shift();
					if(nextOption) {
						if(!nextOption.classList.contains('__disabled')) {
							this._focusOn(nextOption);
						} else {
							this._focusOnNextOption(nextOption);
						}
					}
				}
			};
		},

		_getPrevGroup : function(group) {
			var prevGroup = domutils.prev(group,optionGroupSelector);
			if(prevGroup) {
				if(prevGroup.classList.contains('__disabled')) {
					// skip this group
					return this._getPrevGroup(prevGroup);
				} else {
					return prevGroup;
				}
			} else {
				return false;
			}
		},

		_getNextGroup : function(group) {
			var nextGroup = domutils.next(group, optionGroupSelector);
			if(nextGroup) {
				if(nextGroup.classList.contains('__disabled')) {
					// skip this group
					return this._getNextGroup(nextGroup);
				} else {
					return nextGroup;
				}
			} else {
				return false;
			}
		},

		//  render functions
		render : function (select) {
			var self = this;
			var ariaEnabled = this.config.ariaEnabled;

			var el = document.createElement('div');
			el.id = this.select.id + '-selection-box';
			el.classList.add('selection-box');
			el.setAttribute('data-state', 'closed');

			if(select.disabled) {
				el.classList.add('__disabled');
			}

			var displayArea = this._renderDisplayArea(select.disabled);

			var optionList = document.createElement('div');
			optionList.id = this._generateId('option-list');
			optionList.classList.add('option-list');
			optionList.setAttribute('role', 'listbox');
			optionList.setAttribute('aria-hidden', true);
			optionList.setAttribute('aria-labelledby', this._generateId('display-area'));

			el.appendChild(displayArea);
			el.appendChild(optionList);

			this._renderOptions(optionList);

			return el;
		},

		_shouldOpenAboveDisplayArea : function (displayAreaDimensions, optionListDimensions) {

			//  default is to display option list below the display area.
			//  if there is not sufficient space, then we should display it above the display area.
			var spaceBelowDisplayArea = window.innerHeight - (displayAreaDimensions.height + displayAreaDimensions.top)
			return this.config.optionListMaxHeight > spaceBelowDisplayArea;

		},

		_positionOptionList : function (displayArea, optionList) {

			var displayAreaDimensions = _getElementDimensions(displayArea);
			if (this._shouldOpenAboveDisplayArea(displayAreaDimensions)) {
				optionList.classList.remove('below');
				optionList.classList.add('above');
			} else {
				optionList.classList.remove('above');
        optionList.classList.add('below');

			}
			optionList.style.maxHeight = this.config.optionListMaxHeight + 'px';
		},

		_renderOptions : function(optionList) {
			var self = this;
			var select = this.select;
			var ariaEnabled = this.config.ariaEnabled;

			if(_hasGroups(select)) {
				var groups = _toArray(select.querySelectorAll('optgroup'));
				groups.forEach(function(optionGroup) {
					optionList.appendChild(self._renderOptionGroup(optionGroup, ariaEnabled));
				});
			} else {
				var options = _toArray(select.querySelectorAll('option'));
				options.forEach(function(option) {
					optionList.appendChild(self._renderOption(option, select.disabled, ariaEnabled));
				});
			}
		},

		_renderDisplayArea : function (disabled) {

			var displayArea = document.createElement('div');

			var selectedOption = this._getSelectedOptionFromFoundationSelect();

			displayArea.classList.add('display-area');
			displayArea.setAttribute('tabindex', disabled ? null : 0);
			displayArea.id = this._generateId('display-area')

			var text = _getSelectedTextFromOption(selectedOption);
			var value = selectedOption.value;
			displayArea.innerHTML = this.config.renderDisplayArea(text, value);

			if(this.config.ariaEnabled) {

				displayArea.setAttribute('role', 'button');
				displayArea.setAttribute('aria-haspopup', true);
				displayArea.setAttribute('aria-owns', this._generateId('option-list'));
			}
			return displayArea;
		},
		//  tested
		_renderOptionGroup : function (optionGroup, ariaEnabled) {

			var self = this;

			var optionGroupEl = document.createElement('div');
			optionGroupEl.classList.add('option-group');

			optionGroupEl.appendChild(_renderOptionGroupLabel(optionGroup.label));

			if(optionGroup.disabled) {
				optionGroupEl.classList.add('__disabled');
			}
			_toArray(optionGroup.querySelectorAll('option')).forEach(function (option){
				optionGroupEl.appendChild(self._renderOption(option, optionGroup.disabled, ariaEnabled));
			});

			return optionGroupEl;
		},
		//  tested
		_renderOption : function(option, parentDisabled, ariaEnabled) {

			var optionEl = document.createElement('div');
			optionEl.classList.add('option');
			//  todo : should set to '' if disabled?
			optionEl.setAttribute('tabindex', (option.disabled || parentDisabled) ? null : -1);
			optionEl.setAttribute('data-value', option.value || option.innerHTML );

			var text = option.label || option.innerHTML;

			optionEl.innerHTML = this.config.renderOption(text)

			if(ariaEnabled) {
				optionEl.setAttribute('role', 'option');
				optionEl.setAttribute('aria-selected', option.selected);
			}

			if(option.selected) {
				optionEl.classList.add('__selected');
			}

			if(option.disabled || parentDisabled) {
				optionEl.classList.add('__disabled');
			}
			return optionEl;
		},
		//  tested
		_getOptionByIndex : function (index) {
			return this.el.querySelectorAll(optionSelector)[index];
		},

		_getCurrentSelected : function () {
			return domutils.$('.__selected', this.el);
		},

		_generateId : function (suffix) {
			return this.id + '-' + suffix;
		},

		// foundation select functions

		_getSelectedOptionFromFoundationSelect : function () {
      return this.select.options[ this.select.selectedIndex ];
		}
	};

	//  stateless functions

	function _renderOptionGroupLabel(label) {

		var optionGroupLabel = document.createElement('div');
		optionGroupLabel.classList.add('option-group-label');
		optionGroupLabel.appendChild(document.createTextNode(label));

		return optionGroupLabel;

	}

	//  foundation select utility functions

	function _getSelectedTextFromOption(option) {
		return option.label || option.innerHTML;
	}

	function _hasGroups(select) {
		return select.querySelectorAll('optgroup').length > 0;
	}

	// other utils
	function _toArray(arrayLike){
		return Array.prototype.slice.call(arrayLike);
	}

	function _getElementDimensions(el) {
		return el.getBoundingClientRect();
	}




	return SelectionBox;
});