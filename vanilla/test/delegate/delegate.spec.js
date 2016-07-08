describe('delegate()', function () {

	var el, html;

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
	});

	describe('when event is fired on target element', function () {
		var spyOnListener;
		beforeEach(function () {

			html = [
				'<div id="root">',
					'<div id="foo">foo</div>',
				'</div>'
			].join();

			el.innerHTML = html;

			var listener = function () {
				console.log('listener');
			}

			spyOnListener = jasmine.createSpy('event listener');

			var root = document.getElementById('root');

			delegate(root, {
				'click #foo' : spyOnListener
			});


		});
		it('should call listener', function () {
			document.getElementById('foo').click();
			expect(spyOnListener).toHaveBeenCalled();
		});
	});
});