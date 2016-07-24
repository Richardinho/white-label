var express = require('express');

var app = express();
var port = 6579;

app.use('/js', express.static('js'));
app.use('/selection-box', express.static('./bower_components/selection-box/build'));
app.get('*', function (req, res) {
	res.sendFile(__dirname +  '/index.html')

});

function bootstrap() {
	console.log('listening on:', port);
}

app.listen(port, bootstrap);