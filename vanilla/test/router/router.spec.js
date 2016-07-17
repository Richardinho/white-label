describe('router', function () {

	var router;

	describe('createRoute()', function () {
		var spyOnHandler, route, routeRegex, spyOnRouteToRegex, routeRegex;
		beforeEach(function () {
			routeRegex = 'foobarrouteregex';
			spyOnHandler = jasmine.createSpy('spyOnHandler');
			spyOnRouteToRegex = spyOn(Router.prototype, 'routeToRegex').and.returnValue(routeRegex);
			route = Router.prototype.createRoute('foo/bar', spyOnHandler );
		});
		it('should return route', function () {
			expect(route).toEqual({ 'routeRegex' : routeRegex, 'handler' : spyOnHandler });
		});
	});

	describe('routeToRegex()', function () {
		var regex;
		describe('simple routes', function () {
			it('should convert route to regex', function () {
				regex = Router.prototype.routeToRegex('');
				expect(regex).toEqual(/^(?:\?([\s\S]*))?$/);
			});
			it('should convert route to regex', function () {
				regex = Router.prototype.routeToRegex('foo');
				expect(regex).toEqual(/^foo(?:\?([\s\S]*))?$/);
			});
			it('should convert route to regex', function () {
				regex = Router.prototype.routeToRegex('foo/bar');
				expect(regex).toEqual(/^foo\/bar(?:\?([\s\S]*))?$/);
			});
			it('should convert route to regex', function () {
				regex = Router.prototype.routeToRegex('foo/bar/moo');
				expect(regex).toEqual(/^foo\/bar\/moo(?:\?([\s\S]*))?$/);
			});
		});

		it('should convert route to regex', function () {
			regex = Router.prototype.routeToRegex('foo/:bar');
			expect(regex).toEqual(/^foo\/([^\/?]+)(?:\?([\s\S]*))?$/);
		});
	});
});