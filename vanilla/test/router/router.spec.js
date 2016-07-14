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
});