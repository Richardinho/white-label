/**
		* This file provided by Facebook is for non-commercial testing and evaluation
		* purposes only. Facebook reserves all rights not expressly granted.
		*
		* THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
		* IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
		* FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL
		* FACEBOOK BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN
		* ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
		* WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
		*/

	 var fs = require('fs');
	 var path = require('path');
	 var express = require('express');
	 var bodyParser = require('body-parser');
	 var app = express();

	 var defaultParams = {
			'year-from' : 50,
			'year-to'   : 300,
			'dynasty'   : 'Flavian',
			'sort-by'   : 'succession'
	 };

	 var EMPERORS_FILE = path.join(__dirname, 'emperors.json');

	 app.set('port', (process.env.PORT || 3000));

	 app.use('/', express.static(path.join(__dirname, 'web')));
	 app.use(bodyParser.json());
	 app.use(bodyParser.urlencoded({extended: true}));

	 // Additional middleware which will set headers that we need on each request.
	 app.use(function(req, res, next) {
			// Set permissive CORS header - this allows this server to be used only as
			// an API server in conjunction with something like webpack-dev-server.
			res.setHeader('Access-Control-Allow-Origin', '*');

			// Disable caching so we'll always get the latest comments.
			res.setHeader('Cache-Control', 'no-cache');
			next();
	 });

	app.get('/api/emperor', function(req, res) {
		setTimeout(function () {
			res.sendFile(createEmperorFileName(req.param('id')));
		}, 1000); //  choking response time
	});

	function createEmperorFileName (id) {
		return path.join(__dirname, 'emperors/' + id + '.html');
	}

	app.get('/api/emperors', function(req, res) {
		fs.readFile(EMPERORS_FILE, function(err, data) {
			if (err) {
				console.error(err);
				process.exit(1);
			}
			var json = JSON.parse(data);

			var dynastyFilterOption = getDynastyFilterOption(req);
			var yearFrom = getYearFrom(req);
			var yearTo = getYearTo(req);
			var sortOption = getSortOption(req);

			var filtered = filterBy(json, dynastyFilterOption, yearFrom, yearTo);

			setTimeout(function () {
				res.json({
					results : sortBy(filtered, sortOption),
					criteria : {
						'dynasty' : dynastyFilterOption,
						'yearFrom' : yearFrom,
						'yearTo' : yearTo,
						'sortBy' : sortOption,
						minYear : -50,
						maxYear : 400
					}
				});
			}, 1000); //  choking response time
		});
	 });

	function getYearFrom(request) {
		var yearFrom = request.param('year-from');
		return yearFrom ? yearFrom : defaultParams['year-from'];
	}

	function getYearTo(request) {
		var yearTo = request.param('year-to');
		return yearTo ? yearTo : defaultParams['year-to'];
	}

	function getSortOption (request) {
		var sortBy = request.param('sort-by');
		return sortBy ?
			sortBy : 'succession';
	}

	function getDynastyFilterOption(request) {
		var dynasty = request.param('dynasty');
		return dynasty ? dynasty : defaultParams['dynasty']; // default for the moment
	}

	function filterBy(data, dynasty, from, to) {

		data = data.filter(function(emperor){
			return emperor.to > from && emperor.from < to;
		});

		return data.filter(function(emperor) {
			if(dynasty == 'all') return true;
			return emperor.dynasty == dynasty;
		});
	}

	function sortBy(data, sortOption) {
		if(sortOption == 'reign-asc') {
			return data.sort(function (a,b) {
				return getReign(a) - getReign(b);
			});
		} else if(sortOption == 'reign-desc'){
			return data.sort(function (a,b) {
				return getReign(b) - getReign(a);
			});
		} else { //  succession
			return data.sort(function (a,b) {
				return a.from - b.from;
			});
		}
	}

	function getReign(emperor) {
		return emperor.to - emperor.from;
	}
	 
	app.listen(app.get('port'), function() {
		console.log('Server started: http://localhost:' + app.get('port') + '/');
	});