var React = require('react/addons'),
	timelineJsonData = require('../data/timeline.json'),
	axios = require('axios'),
	HoH = React.createFactory(require('../js/dispatcher.js'));

function isset (obj) { return typeof obj !== 'undefined'; }

module.exports = function(app) {
	app.get('/', function(req, res) {
		// React.renderToString takes your component and generates rendered markup. SEO friendliness all the way
		var staticHTML = React.renderToString(HoH ({ timeline: timelineJsonData, initparams: false }));
		res.render('index.ejs', { reactOutput: staticHTML });
	});

	app.get('/:year/:position/:name', function(req, res) {
		var initData = {
			itemDetail: timelineJsonData[req.params.year][req.params.position],
			wikiData: false,
			wikiImages: []
		};

		var wikiApiLink = 'https://en.wikipedia.org/w/api.php?format=json&action=query&prop=extracts|images&exintro=&explaintext=&titles=' + req.params.name;

		axios.get('https://apis.builtvisible.com/history_of_humanity/?url=' + encodeURIComponent(wikiApiLink.replace(/&amp;/g, "&"))).then(function (output) {
			if (isset(output.data.query.pages)) {
				var pageId = Object.keys(output.data.query.pages);
				initData.wikiData = output.data.query.pages[pageId];

				// React.renderToString takes your component and generates rendered markup. SEO friendliness all the way
				var staticHTML = React.renderToString(HoH ({ timeline: timelineJsonData, initparams: req.params, initwikidata: initData }));
				res.render('index.ejs', { reactOutput: staticHTML });
			}
		})
		.catch(function (e) {
			console.log('error in xhr');
			console.log(e);
		});
	});
};