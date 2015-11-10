require("babel-core/register")({ presets: ['es2015', 'react', 'stage-1'] })

var express = require('express'),
	path = require('path'),
	app = express(),
	ip = '0.0.0.0',
	port = 3000,
	bodyParser = require('body-parser')

// Include static assets
app.use(express.static(path.join(__dirname, 'public')));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// Set up routing
require('./app/routes/core-routes.js')(app);

// Set 404
app.get('*', function(req, res) {
	res.json({
		"route": "Sorry this page does not exist!"
	});
});

app.listen(port, ip);

console.log('Server is Up and Running at Port : ' + port);