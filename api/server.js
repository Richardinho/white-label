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
	 
	 app.get('/api/emperors', function(req, res) {
		fs.readFile(EMPERORS_FILE, function(err, data) {
			if (err) {
				console.error(err);
				process.exit(1);
			}
			res.json(sortBy(JSON.parse(data), getSortOption(req)));
		});
	 });

	function getSortOption (request) {
		var sortBy = request.param('sort-by');
		return sortBy ?
			sortBy : 'succession';
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
		} else {
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