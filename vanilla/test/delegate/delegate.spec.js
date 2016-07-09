describe('delegate()', function () {

	var el;

	beforeEach(function () {
		el = document.createElement('div');
		document.body.appendChild(el);
	});

	afterEach(function () {
		document.body.removeChild(el);
	});

	describe('splitEventFromSelector()', function () {
		describe('When key is \'click #foo\'', function () {
			it('should return [\'click\', \'#foo\']', function () {
				expect(splitEventFromSelector('click #foo')).toEqual(['click', '#foo']);
			});
		});
		describe('When key is \'click #foo > div .bar\'', function () {
			it('should return [\'click\', \'#foo > div .bar\']', function () {
				expect(splitEventFromSelector('click #foo > div .bar')).toEqual(['click', '#foo > div .bar']);
			});
		});
	});
	describe('delegate()', function () {
		var listener, delegateEl, delegatorEl, physicalEl, html;
		beforeEach(function () {
			html = [
				'<div id="root">',
					'<div id="foo"><div id="bar">bar</div></div>',
				'</div>'
			].join();
			el.innerHTML = html;
			listener = jasmine.createSpy('listener');
			delegateEl = document.getElementById('root');
			delegatorEl = document.getElementById('foo');
			physicalEl = document.getElementById('bar');
		});
		describe('when no selector is provided', function () {
			beforeEach(function () {
				delegate(delegateEl, {
					'click' : listener
				});
			});
			it('should call listener', function () {
				physicalEl.click();
				expect(listener).toHaveBeenCalled();
			});
		});
		describe('when selector is provided', function () {
			var fooEl, barEl;
			beforeEach(function () {
				delegate(delegateEl, {
					'click #foo' : listener
				});
				physicalEl.click();
			});
			it('should call listener', function () {
				expect(listener).toHaveBeenCalled();
			});
			describe('event object passed to listener', function () {
				it('should have currentTarget set to DELEGATE (root) element', function () {
					expect(listener.calls.argsFor(0)[0].currentTarget).toBe(delegateEl)
				});
				it('should have target set to DELEGATOR (selector) element', function () {
					expect(listener.calls.argsFor(0)[0].target).toBe(delegatorEl);
				});
			});
		});
	});
});