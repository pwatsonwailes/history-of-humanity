var React = require('react/addons'),
	timelineJsonData = require('../data/timeline.json'),
	HoH = React.createFactory(require('../js/dispatcher.js'));

module.exports = function(app) {
	app.get('/', function(req, res) {
		// React.renderToString takes your component and generates rendered markup. SEO friendliness all the way
		var staticHTML = React.renderToString(HoH ({ timeline: timelineJsonData, initParams: false }));
		res.render('index.ejs', { reactOutput: staticHTML });
	});

	app.get('/:year/:position/:name', function(req, res) {
		// React.renderToString takes your component and generates rendered markup. SEO friendliness all the way
		var staticHTML = React.renderToString(HoH ({ timeline: timelineJsonData, initparams: req.params }));
		res.render('index.ejs', { reactOutput: staticHTML });
	});
};