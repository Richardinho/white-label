var express = require('express');

var app = express();
var port = 6578;

app.use('/bower_components', express.static('bower_components'));
app.use('/js', express.static('js'));
app.get('*', function (req, res) {
	res.sendFile(__dirname +  '/index.html')

});

function bootstrap() {
	console.log('listening on:', port);
}

app.listen(port, bootstrap);